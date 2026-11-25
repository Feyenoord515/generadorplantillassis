import React, { useEffect } from "react";
import { EyeOff, Mail, Send, X } from "lucide-react";

export default function ConfirmSendModal({
  isOpen,
  theme = "dark",
  emailSubject,
  recipients = [],
  bccRecipients = [],
  isLoading,
  onCancel,
  onConfirm,
}) {
  const isDark = theme === "dark";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-send-title"
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-colors ${
          isDark
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-[#102F45]"
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0879CB]/15 text-[#0879CB]">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirm-send-title" className="text-base font-bold">
                Confirmar envío
              </h3>
              <p
                className={`text-xs ${
                  isDark ? "text-slate-400" : "text-[#536F83]"
                }`}
              >
                Revisá el asunto y los destinatarios antes de enviar.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            aria-label="Cerrar"
            className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className={`rounded-xl border p-3.5 space-y-3 mb-5 text-xs ${
            isDark
              ? "bg-slate-950/70 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <span className={isDark ? "text-slate-400" : "text-[#536F83]"}>
              Asunto:
            </span>
            <p className="font-semibold text-sm mt-0.5 break-words">
              {emailSubject || "(Sin asunto)"}
            </p>
          </div>

          {recipients.length > 0 && (
            <div>
              <span className={isDark ? "text-slate-400" : "text-[#536F83]"}>
                Para ({recipients.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-28 overflow-y-auto">
                {recipients.map((email) => (
                  <span
                    key={email}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                      isDark
                        ? "bg-slate-900 border-slate-700 text-slate-200"
                        : "bg-white border-slate-200 text-[#102F45]"
                    }`}
                  >
                    <Mail className="w-3 h-3 text-[#0879CB]" />
                    <span>{email}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {bccRecipients.length > 0 && (
            <div>
              <span className={isDark ? "text-amber-300" : "text-amber-700"}>
                Copia oculta · CCO ({bccRecipients.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-28 overflow-y-auto">
                {bccRecipients.map((email) => (
                  <span
                    key={email}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                      isDark
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}
                  >
                    <EyeOff className="w-3 h-3 text-amber-500" />
                    <span>{email}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isDark
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-300 text-[#536F83] hover:bg-slate-100"
            }`}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#0879CB] hover:bg-[#0667AE] disabled:opacity-60 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Enviando..." : "Confirmar y enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
