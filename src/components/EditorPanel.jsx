import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Megaphone,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

const SEVERITY_OPTIONS = [
  {
    value: "high",
    label: "Urgente",
    icon: AlertTriangle,
    activeDark: "bg-red-500/20 border-red-500 text-red-300",
    activeLight: "bg-red-50 border-red-500 text-red-700",
  },
  {
    value: "medium",
    label: "Moderado",
    icon: Info,
    activeDark: "bg-amber-500/20 border-amber-500 text-amber-300",
    activeLight: "bg-amber-50 border-amber-500 text-amber-700",
  },
  {
    value: "low",
    label: "Informativo",
    icon: CheckCircle2,
    activeDark: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
    activeLight: "bg-emerald-50 border-emerald-500 text-emerald-700",
  },
  {
    value: "announcement",
    label: "Anuncio",
    icon: Megaphone,
    activeDark: "bg-sky-500/20 border-[#0879CB] text-sky-300",
    activeLight: "bg-sky-50 border-[#0879CB] text-[#0879CB]",
  },
];

export default function EditorPanel({
  theme = "dark",
  severity,
  setSeverity,
  title,
  setTitle,
  reason,
  setReason,
  impact,
  setImpact,
  instructions,
  setInstructions,
  customSections,
  onAddCustomSection,
  onRemoveCustomSection,
  onCustomSectionChange,
  showPersistentIssueSection,
  setShowPersistentIssueSection,
  onReset,
}) {
  const isDark = theme === "dark";

  const labelClass = `block text-xs font-semibold mb-1.5 ${
    isDark ? "text-slate-300" : "text-[#536F83]"
  }`;

  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0879CB] transition-colors ${
    isDark
      ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500"
      : "bg-slate-50 border-slate-300 text-[#102F45] placeholder-slate-400"
  }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? "text-slate-400" : "text-[#536F83]"
          }`}
        >
          Tipo de comunicado
        </span>
        <button
          type="button"
          onClick={onReset}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            isDark
              ? "border-slate-700 text-slate-300 hover:bg-slate-800"
              : "border-slate-300 text-[#536F83] hover:bg-slate-100"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Nuevo / Limpiar
        </button>
      </div>

      {/* Selector visual de severidad */}
      <div className="grid grid-cols-2 gap-2">
        {SEVERITY_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = severity === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSeverity(opt.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                isActive
                  ? isDark
                    ? opt.activeDark
                    : opt.activeLight
                  : isDark
                    ? "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    : "bg-slate-50 border-slate-200 text-[#536F83] hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        <label htmlFor="editor-title" className={labelClass}>
          Título
        </label>
        <input
          id="editor-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Mantenimiento programado en SAP"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="editor-reason" className={labelClass}>
          Motivo
        </label>
        <textarea
          id="editor-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describí brevemente el motivo del aviso..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="editor-impact" className={labelClass}>
          Impacto
        </label>
        <textarea
          id="editor-impact"
          rows={2}
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="Qué usuarios o servicios se ven afectados..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="editor-instructions" className={labelClass}>
          Instrucciones (una por línea)
        </label>
        <textarea
          id="editor-instructions"
          rows={3}
          value={instructions.join("\n")}
          onChange={(e) => setInstructions(e.target.value.split("\n"))}
          placeholder="Paso 1&#10;Paso 2"
          className={inputClass}
        />
      </div>

      {/* Secciones Personalizadas */}
      <div className="pt-1 space-y-2.5">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-[#536F83]"
            }`}
          >
            Secciones personalizadas
          </span>
          <button
            type="button"
            onClick={onAddCustomSection}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#0879CB] hover:bg-[#0667AE] text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>

        {customSections.map((section, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border space-y-2 ${
              isDark
                ? "bg-slate-950/70 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Título de la sección"
                value={section.title}
                onChange={(e) =>
                  onCustomSectionChange(index, "title", e.target.value)
                }
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => onRemoveCustomSection(index)}
                title="Eliminar sección"
                aria-label="Eliminar sección"
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/15 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={2}
              placeholder="Contenido de la sección"
              value={section.content}
              onChange={(e) =>
                onCustomSectionChange(index, "content", e.target.value)
              }
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <label
        className={`flex items-center gap-2.5 pt-1 text-xs font-medium cursor-pointer ${
          isDark ? "text-slate-300" : "text-[#102F45]"
        }`}
      >
        <input
          type="checkbox"
          checked={showPersistentIssueSection}
          onChange={(e) => setShowPersistentIssueSection(e.target.checked)}
          className="rounded border-slate-400 text-[#0879CB] focus:ring-[#0879CB]"
        />
        <span>Mostrar sección &quot;Si el problema persiste&quot;</span>
      </label>
    </div>
  );
}
