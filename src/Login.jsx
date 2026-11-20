import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lock, Moon, Sun, User } from "lucide-react";
import BrandLogo from "./components/BrandLogo";

const userCredentials = {
  admin: process.env.REACT_APP_ADMIN,
  Mauricio: process.env.REACT_APP_MAURICIO,
  Matias: process.env.REACT_APP_MATIAS,
  Octavio: process.env.REACT_APP_OCTAVIO,
  Guillermo: process.env.REACT_APP_GUILLERMO,
};

function Login({ onLogin, theme = "dark", onToggleTheme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isDark = theme === "dark";

  const handleLogin = (event) => {
    event.preventDefault();

    if (userCredentials[username] && userCredentials[username] === password) {
      onLogin(true, username);
    } else {
      toast.error("Credenciales incorrectas", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center p-4 transition-colors ${
        isDark ? "bg-[#0A2338] text-slate-100" : "bg-[#F1F7FB] text-[#102F45]"
      }`}
    >
      {onToggleTheme && (
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className={`absolute top-4 right-4 inline-flex items-center justify-center p-2.5 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              : "bg-white border-slate-200 text-[#102F45] hover:bg-slate-50 shadow-sm"
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#0879CB]" />
          )}
        </button>
      )}

      <div
        className={`w-full max-w-md rounded-2xl border p-8 shadow-xl transition-colors ${
          isDark
            ? "bg-slate-900/95 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size={56} className="mb-3" />
          <h1
            className={`text-xl font-bold tracking-tight ${
              isDark ? "text-slate-100" : "text-[#102F45]"
            }`}
          >
            Comunicados Sistemas
          </h1>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-slate-400" : "text-[#536F83]"
            }`}
          >
            Distrinando S.A. · Área de Sistemas
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="login-username"
              className={`block text-xs font-medium mb-1.5 ${
                isDark ? "text-slate-300" : "text-[#536F83]"
              }`}
            >
              Usuario
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#0879CB] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-username"
                type="text"
                placeholder="Ingresá tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0879CB] transition-colors ${
                  isDark
                    ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500"
                    : "bg-slate-50 border-slate-300 text-[#102F45] placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className={`block text-xs font-medium mb-1.5 ${
                isDark ? "text-slate-300" : "text-[#536F83]"
              }`}
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#0879CB] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0879CB] transition-colors ${
                  isDark
                    ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500"
                    : "bg-slate-50 border-slate-300 text-[#102F45] placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0879CB] hover:bg-[#0667AE] text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Entrar
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
