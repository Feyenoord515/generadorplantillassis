import React, { useMemo, useState } from "react";
import { Eye, FileText, Search, Trash2 } from "lucide-react";

const SEVERITY_BADGES = {
  high: {
    label: "Urgente",
    dark: "bg-red-500/20 text-red-300 border-red-500/30",
    light: "bg-red-50 text-red-700 border-red-200",
  },
  medium: {
    label: "Moderado",
    dark: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    light: "bg-amber-50 text-amber-700 border-amber-200",
  },
  low: {
    label: "Informativo",
    dark: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  announcement: {
    label: "Anuncio",
    dark: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    light: "bg-sky-50 text-[#0879CB] border-sky-200",
  },
};

export default function TemplatesPanel({
  theme = "dark",
  templates,
  onSelect,
  onDelete,
  onPreview,
  pinnedPreviewId = null,
  onTogglePinPreview,
}) {
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => {
      const title = t.state?.title || "";
      const reason = t.state?.reason || "";
      return (
        title.toLowerCase().includes(q) || reason.toLowerCase().includes(q)
      );
    });
  }, [templates, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 text-[#0879CB] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar plantilla guardada..."
          className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0879CB] transition-colors ${
            isDark
              ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500"
              : "bg-slate-50 border-slate-300 text-[#102F45] placeholder-slate-400"
          }`}
        />
      </div>

      {filteredTemplates.length === 0 ? (
        <div
          className={`text-center py-8 px-4 rounded-xl border border-dashed text-xs ${
            isDark
              ? "border-slate-800 text-slate-400"
              : "border-slate-300 text-[#536F83]"
          }`}
        >
          <FileText className="w-6 h-6 mx-auto mb-2 opacity-60" />
          {templates.length === 0
            ? "Todavía no tenés plantillas guardadas."
            : "Ninguna plantilla coincide con tu búsqueda."}
        </div>
      ) : (
        <div
          className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1"
          onMouseLeave={() => onPreview?.(null)}
        >
          {filteredTemplates.map((template) => {
            const sev =
              SEVERITY_BADGES[template.state?.severity] || SEVERITY_BADGES.low;
            const isConfirming = confirmDeleteId === template.id;
            const isPinned = pinnedPreviewId === template.id;
            const formattedDate = template.createdAt
              ? new Date(template.createdAt).toLocaleDateString("es-AR")
              : null;

            return (
              <div
                key={template.id}
                onMouseEnter={() => onPreview?.(template)}
                className={`rounded-xl border p-3.5 transition-colors ${
                  isPinned
                    ? "border-[#0879CB] ring-1 ring-[#0879CB]/40 " +
                      (isDark ? "bg-slate-900" : "bg-sky-50/60")
                    : isDark
                      ? "bg-slate-950/70 border-slate-800 hover:border-[#0879CB]/60"
                      : "bg-slate-50 border-slate-200 hover:border-[#0879CB]/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      isDark ? sev.dark : sev.light
                    }`}
                  >
                    {sev.label}
                  </span>
                  {formattedDate && (
                    <span
                      className={`text-[11px] ${
                        isDark ? "text-slate-500" : "text-[#536F83]"
                      }`}
                    >
                      {formattedDate}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold line-clamp-1">
                  {template.state?.title || "Sin título"}
                </h4>
                <p
                  className={`text-xs mt-1 line-clamp-2 ${
                    isDark ? "text-slate-400" : "text-[#536F83]"
                  }`}
                >
                  {template.state?.reason || "Sin descripción"}
                </p>

                <div className="flex items-center justify-between gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => onSelect(template)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#0879CB] hover:bg-[#0667AE] text-white transition-colors"
                  >
                    Cargar plantilla
                  </button>

                  {onTogglePinPreview && (
                    <button
                      type="button"
                      onClick={() => onTogglePinPreview(template)}
                      title={
                        isPinned
                          ? "Cerrar vista previa"
                          : "Fijar vista previa"
                      }
                      aria-label={
                        isPinned
                          ? "Cerrar vista previa"
                          : "Fijar vista previa"
                      }
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isPinned
                          ? "bg-[#0879CB]/20 border-[#0879CB] text-[#0879CB]"
                          : isDark
                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "border-slate-300 text-[#536F83] hover:bg-slate-200"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  {isConfirming ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(template.id);
                          setConfirmDeleteId(null);
                        }}
                        className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className={`py-1.5 px-2 rounded-lg text-xs border transition-colors ${
                          isDark
                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "border-slate-300 text-[#536F83] hover:bg-slate-200"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(template.id)}
                      title="Eliminar plantilla"
                      aria-label="Eliminar plantilla"
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
