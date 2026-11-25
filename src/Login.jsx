import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Eye,
  EyeOff,
  Lock,
  Moon,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import BrandLogo from "./components/BrandLogo";

const userCredentials = {
  admin: process.env.REACT_APP_ADMIN,
  Mauricio: process.env.REACT_APP_MAURICIO,
  Matias: process.env.REACT_APP_MATIAS,
  Juan: process.env.REACT_APP_JUAN,
  Facu: process.env.REACT_APP_FACU,
};

function Login({ onLogin, theme = "dark", onToggleTheme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const isDark = theme === "dark";

  const handleContainerMouseMove = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const handleCardMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 3.5;
    const rotateX = -(y / rect.height - 0.5) * 3.5;

    el.style.setProperty("--card-x", `${x}px`);
    el.style.setProperty("--card-y", `${y}px`);
    el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
      2
    )}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (userCredentials[username] && userCredentials[username] === password) {
      setHasError(false);
      onLogin(true, username);
    } else {
      setHasError(true);
      setShakeCount((c) => c + 1);
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

  const statusConfig = hasError
    ? {
        dot: "bg-red-500",
        text: "Credenciales inválidas · Verificá usuario y clave",
        textColor: isDark ? "text-red-300" : "text-red-700",
        bg: isDark
          ? "bg-red-500/10 border-red-500/30"
          : "bg-red-50 border-red-200",
      }
    : isFocused || username || password
      ? {
          dot: "bg-[#38BDF8] animate-pulse",
          text: "Ingresando credenciales de acceso...",
          textColor: isDark ? "text-sky-200" : "text-[#102F45]",
          bg: isDark
            ? "bg-[#0879CB]/10 border-[#0879CB]/30"
            : "bg-sky-50 border-sky-200",
        }
      : {
          dot: "bg-emerald-500",
          text: "Sistema operativo · Listo para autenticar",
          textColor: isDark ? "text-slate-300" : "text-[#536F83]",
          bg: isDark
            ? "bg-slate-950/70 border-slate-800"
            : "bg-slate-50 border-slate-200",
        };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      className={`relative flex min-h-screen items-center justify-center p-4 overflow-hidden transition-colors ${
        isDark ? "bg-[#0A2338] text-slate-100" : "bg-[#F1F7FB] text-[#102F45]"
      }`}
      style={{
        "--spot-x": "50%",
        "--spot-y": "45%",
      }}
    >
      {/* Spotlight ambiental sutil siguiendo al cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: isDark
            ? "radial-gradient(540px circle at var(--spot-x) var(--spot-y), rgba(8, 121, 203, 0.22), transparent 70%)"
            : "radial-gradient(540px circle at var(--spot-x) var(--spot-y), rgba(8, 121, 203, 0.12), transparent 70%)",
        }}
      />

      {/* Grilla técnica sutil revelada cerca del cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px)"
            : "radial-gradient(rgba(16, 47, 69, 0.16) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(380px circle at var(--spot-x) var(--spot-y), black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(380px circle at var(--spot-x) var(--spot-y), black, transparent 80%)",
        }}
      />

      {onToggleTheme && (
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className={`absolute top-4 right-4 z-20 inline-flex items-center justify-center p-2.5 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800"
              : "bg-white/90 border-slate-200 text-[#102F45] hover:bg-slate-50 shadow-sm"
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#0879CB]" />
          )}
        </button>
      )}

      {/* Contenedor 3D con Border Beam animado y shake en error */}
      <div
        key={shakeCount}
        className={`relative z-10 w-full max-w-md ${
          shakeCount > 0 ? "animate-subtle-shake" : ""
        }`}
      >
        <div
          ref={cardRef}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className={`relative w-full rounded-2xl p-[1.5px] overflow-hidden shadow-2xl transition-transform duration-200 ease-out ${
            isDark
              ? "bg-slate-800/80 shadow-black/40"
              : "bg-slate-200/90 shadow-slate-900/10"
          }`}
          style={{
            "--card-x": "50%",
            "--card-y": "50%",
          }}
        >
          {/* Border Beam animado */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 w-[200%] aspect-square animate-border-beam"
            style={{
              background: hasError
                ? "conic-gradient(from 0deg, transparent 0deg 265deg, #EF4444 315deg, #F87171 340deg, transparent 360deg)"
                : isDark
                  ? "conic-gradient(from 0deg, transparent 0deg 265deg, #0879CB 310deg, #38BDF8 338deg, transparent 360deg)"
                  : "conic-gradient(from 0deg, transparent 0deg 265deg, #0879CB 315deg, #60A5FA 340deg, transparent 360deg)",
            }}
          />

          {/* Tarjeta interna */}
          <div
            className={`relative rounded-[calc(1rem-1.5px)] p-8 transition-colors ${
              isDark ? "bg-slate-900/95" : "bg-white/95"
            }`}
          >
            {/* Glow interno siguiendo el cursor */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[calc(1rem-1.5px)] transition-opacity duration-300"
              style={{
                opacity: isCardHovered ? 1 : 0,
                background: isDark
                  ? "radial-gradient(280px circle at var(--card-x) var(--card-y), rgba(8, 121, 203, 0.14), transparent 70%)"
                  : "radial-gradient(280px circle at var(--card-x) var(--card-y), rgba(8, 121, 203, 0.08), transparent 70%)",
              }}
            />

            <div className="relative z-10">
              {/* Identidad Distrinando con pulso de transmisión */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative flex items-center justify-center w-20 h-20 mb-3">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-1 rounded-full border-2 animate-pulse-ring ${
                      hasError ? "border-red-500/60" : "border-[#0879CB]/60"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-1 rounded-full border animate-pulse-ring-delayed ${
                      hasError ? "border-red-400/50" : "border-[#38BDF8]/50"
                    }`}
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-2 rounded-full blur-md ${
                      hasError ? "bg-red-500/20" : "bg-[#0879CB]/25"
                    }`}
                  />
                  <BrandLogo size={56} className="relative" />
                </div>

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

              {/* Barra de estado operativa */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium mb-5 transition-colors ${statusConfig.bg} ${statusConfig.textColor}`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${statusConfig.dot}`}
                />
                <span className="truncate">{statusConfig.text}</span>
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
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (hasError) setHasError(false);
                      }}
                      autoComplete="username"
                      className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0879CB] transition-colors ${
                        isDark
                          ? "bg-slate-950/90 border-slate-700 text-slate-100 placeholder-slate-500"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresá tu contraseña"
                      value={password}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (hasError) setHasError(false);
                      }}
                      autoComplete="current-password"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0879CB] transition-colors ${
                        isDark
                          ? "bg-slate-950/90 border-slate-700 text-slate-100 placeholder-slate-500"
                          : "bg-slate-50 border-slate-300 text-[#102F45] placeholder-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Ocultar contraseña" : "Ver contraseña"
                      }
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                        isDark
                          ? "text-slate-400 hover:text-slate-200"
                          : "text-slate-500 hover:text-[#102F45]"
                      }`}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#0879CB] hover:bg-[#0667AE] active:scale-[0.99] text-white font-semibold rounded-lg transition-all shadow-md shadow-[#0879CB]/25"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Ingresar al sistema
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer theme={isDark ? "dark" : "light"} />
    </div>
  );
}

export default Login;
