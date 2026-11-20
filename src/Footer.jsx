import React from "react";

function Footer({ text, theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <footer
      className={`border-t transition-colors ${
        isDark
          ? "bg-slate-950 border-slate-800 text-slate-400"
          : "bg-white border-slate-200 text-[#536F83]"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <p>{text}</p>
        <p className="opacity-80">Distrinando S.A. · Comunicaciones Internas</p>
      </div>
    </footer>
  );
}

export default Footer;
