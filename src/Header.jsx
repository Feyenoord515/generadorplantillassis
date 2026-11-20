import React from "react";
import { LogOut, Moon, Sun, User } from "lucide-react";
import BrandLogo from "./components/BrandLogo";

function Header({ title, currentUser, theme = "dark", onToggleTheme, onLogout }) {
  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
        isDark
          ? "bg-slate-950/90 border-slate-800 text-slate-100"
          : "bg-white/90 border-slate-200 text-[#102F45]"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Marca + Título */}
        <div className="flex items-center gap-3 min-w-0">
          <BrandLogo size={38} />
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
              {title}
            </h1>
            <p
              className={`hidden 2xl:block text-xs truncate ${
                isDark ? "text-slate-400" : "text-[#536F83]"
              }`}
            >
              Generador oficial de avisos y mantenimientos · Área de Sistemas
            </p>
          </div>
        </div>

        {/* Acciones de usuario y tema */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentUser && (
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-200"
                  : "bg-[#F1F7FB] border-slate-200 text-[#102F45]"
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#0879CB]" />
              <span>{currentUser}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className={`inline-flex items-center justify-center p-2 rounded-lg border transition-colors ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                : "bg-slate-50 border-slate-200 text-[#102F45] hover:bg-slate-100"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0879CB]" />}
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                isDark
                  ? "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
                  : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">Salir</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
