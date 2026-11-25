import React, { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  CheckSquare,
  EyeOff,
  Mail,
  Plus,
  Search,
  Send,
  Square,
  Trash2,
  X,
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function SendPanel({
  theme = "dark",
  emailSubject,
  setEmailSubject,
  availableAddresses,
  recipients,
  bccRecipients,
  onToggleRecipient,
  onMoveRecipient,
  onSelectAllRecipients,
  onClearRecipients,
  onRemoveRecipient,
  newAddress,
  setNewAddress,
  onAddAddress,
  onDeleteAvailableAddress,
  isLoading,
  isMessageSent,
  onRequestSend,
}) {
  const isDark = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [targetField, setTargetField] = useState("to"); // "to" | "bcc"

  const filteredAddresses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return availableAddresses;
    return availableAddresses.filter((addr) => addr.toLowerCase().includes(q));
  }, [availableAddresses, searchTerm]);

  const totalSelected = recipients.length + bccRecipients.length;

  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0879CB] transition-colors ${
    isDark
      ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500"
      : "bg-slate-50 border-slate-300 text-[#102F45] placeholder-slate-400"
  }`;

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddAddress(targetField);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="send-subject"
          className={`block text-xs font-semibold mb-1.5 ${
            isDark ? "text-slate-300" : "text-[#536F83]"
          }`}
        >
          Asunto del correo
        </label>
        <input
          id="send-subject"
          type="text"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Comunicado desde Sistemas"
          className={inputClass}
        />
      </div>

      {/* Selector de campo destino (Para vs CCO) + acciones masivas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-semibold ${
              isDark ? "text-slate-300" : "text-[#536F83]"
            }`}
          >
            Destinatarios ({totalSelected}/{availableAddresses.length})
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectAllRecipients(targetField)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  : "bg-slate-100 hover:bg-slate-200 text-[#102F45]"
              }`}
            >
              Todos a {targetField === "bcc" ? "CCO" : "Para"}
            </button>
            <button
              type="button"
              onClick={onClearRecipients}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-[#536F83]"
              }`}
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Toggle Para / CCO */}
        <div
          className={`grid grid-cols-2 p-1 rounded-lg border text-xs font-semibold ${
            isDark
              ? "bg-slate-950 border-slate-800"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={() => setTargetField("to")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${
              targetField === "to"
                ? "bg-[#0879CB] text-white shadow-sm"
                : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-[#536F83] hover:text-[#102F45]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Agregar a Para
          </button>
          <button
            type="button"
            onClick={() => setTargetField("bcc")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${
              targetField === "bcc"
                ? "bg-amber-600 text-white shadow-sm"
                : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-[#536F83] hover:text-[#102F45]"
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Agregar a CCO
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#0879CB] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar dirección..."
            className={`${inputClass} pl-9`}
          />
        </div>

        {/* Lista con checkboxes */}
        <div
          className={`max-h-48 overflow-y-auto rounded-lg border divide-y ${
            isDark
              ? "bg-slate-950/70 border-slate-800 divide-slate-800/80"
              : "bg-slate-50 border-slate-200 divide-slate-200"
          }`}
        >
          {filteredAddresses.length === 0 ? (
            <p
              className={`text-xs text-center py-4 ${
                isDark ? "text-slate-500" : "text-[#536F83]"
              }`}
            >
              No hay direcciones que coincidan.
            </p>
          ) : (
            filteredAddresses.map((address) => {
              const inTo = recipients.includes(address);
              const inBcc = bccRecipients.includes(address);
              const selected = inTo || inBcc;

              return (
                <div
                  key={address}
                  className={`flex items-center justify-between gap-2 px-3 py-2 text-xs transition-colors ${
                    inBcc
                      ? isDark
                        ? "bg-amber-500/10 text-slate-100"
                        : "bg-amber-50 text-[#102F45]"
                      : inTo
                        ? isDark
                          ? "bg-[#0879CB]/15 text-slate-100"
                          : "bg-sky-50 text-[#102F45]"
                        : isDark
                          ? "text-slate-300 hover:bg-slate-900"
                          : "text-[#102F45] hover:bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleRecipient(address, targetField)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                  >
                    {selected ? (
                      <CheckSquare
                        className={`w-4 h-4 shrink-0 ${
                          inBcc ? "text-amber-500" : "text-[#0879CB]"
                        }`}
                      />
                    ) : (
                      <Square className="w-4 h-4 opacity-50 shrink-0" />
                    )}
                    <span className="truncate">{address}</span>
                  </button>

                  {selected && (
                    <button
                      type="button"
                      onClick={() => onMoveRecipient(address)}
                      title={inBcc ? "Mover a Para" : "Mover a CCO"}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-colors ${
                        inBcc
                          ? isDark
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                            : "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                          : isDark
                            ? "bg-[#0879CB]/20 border-[#0879CB]/40 text-sky-300 hover:bg-[#0879CB]/30"
                            : "bg-sky-100 border-sky-300 text-[#0879CB] hover:bg-sky-200"
                      }`}
                    >
                      {inBcc ? "CCO" : "Para"}
                    </button>
                  )}

                  {isManageOpen && (
                    <button
                      type="button"
                      onClick={() => onDeleteAvailableAddress(address)}
                      title="Eliminar de la lista"
                      aria-label={`Eliminar ${address}`}
                      className="p-1 rounded text-red-400 hover:bg-red-500/15 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chips de seleccionados: Para */}
      {recipients.length > 0 && (
        <div>
          <p
            className={`text-xs font-semibold mb-1.5 ${
              isDark ? "text-slate-300" : "text-[#536F83]"
            }`}
          >
            Para ({recipients.length}):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {recipients.map((recipient) => (
              <span
                key={recipient}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200"
                    : "bg-sky-50 border-sky-200 text-[#102F45]"
                }`}
              >
                <Mail className="w-3 h-3 text-[#0879CB] shrink-0" />
                <span className="max-w-[150px] truncate">{recipient}</span>
                <button
                  type="button"
                  onClick={() => onMoveRecipient(recipient)}
                  title="Mover a CCO"
                  aria-label={`Mover ${recipient} a CCO`}
                  className="hover:text-amber-400 transition-colors"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveRecipient(recipient)}
                  aria-label={`Quitar ${recipient}`}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chips de seleccionados: CCO */}
      {bccRecipients.length > 0 && (
        <div>
          <p
            className={`text-xs font-semibold mb-1.5 ${
              isDark ? "text-amber-300" : "text-amber-700"
            }`}
          >
            Copia oculta · CCO ({bccRecipients.length}):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {bccRecipients.map((recipient) => (
              <span
                key={recipient}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${
                  isDark
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                <EyeOff className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="max-w-[150px] truncate">{recipient}</span>
                <button
                  type="button"
                  onClick={() => onMoveRecipient(recipient)}
                  title="Mover a Para"
                  aria-label={`Mover ${recipient} a Para`}
                  className="hover:text-[#0879CB] transition-colors"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveRecipient(recipient)}
                  aria-label={`Quitar ${recipient}`}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Agregar / Administrar direcciones */}
      <div
        className={`pt-2 border-t space-y-2.5 ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold ${
              isDark ? "text-slate-300" : "text-[#536F83]"
            }`}
          >
            Agregar dirección
          </span>
          <button
            type="button"
            onClick={() => setIsManageOpen((prev) => !prev)}
            className="text-xs font-medium text-[#0879CB] hover:underline"
          >
            {isManageOpen ? "Listo" : "Administrar lista"}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="email"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            onKeyDown={handleAddKeyDown}
            placeholder="usuario@distrinando.com.ar"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onAddAddress(targetField)}
            title="Agregar dirección"
            aria-label="Agregar dirección"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 py-1">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-[#0879CB]/25 border-t-[#0879CB] animate-spin" />
            <BrandLogo size={28} />
          </div>
          <span className="text-xs font-medium opacity-80">
            Enviando comunicado...
          </span>
        </div>
      )}

      {isMessageSent && !isLoading && (
        <p className="text-xs font-semibold text-emerald-500">
          Mensaje enviado exitosamente.
        </p>
      )}

      <button
        type="button"
        disabled={isLoading}
        onClick={onRequestSend}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#0879CB] hover:bg-[#0667AE] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
      >
        <Send className="w-4 h-4" />
        Enviar Comunicado
      </button>
    </div>
  );
}
