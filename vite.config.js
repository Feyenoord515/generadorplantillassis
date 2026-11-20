import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), ["VITE_", "REACT_APP_"]);
  const combinedEnv = { ...process.env, ...fileEnv };

  const reactAppDefine = Object.fromEntries(
    Object.entries(combinedEnv)
      .filter(([key]) => key.startsWith("REACT_APP_"))
      .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
  );

  return {
    plugins: [react()],
    envPrefix: ["VITE_", "REACT_APP_"],
    define: reactAppDefine,
    server: {
      port: 3000,
      open: false,
    },
    build: {
      outDir: "dist",
    },
  };
});
