import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the monorepo root (two levels up from packages/web)
  // This allows .env files in the root to be used by all packages
  const rootDir = path.resolve(__dirname, "../..");
  const env = loadEnv(mode, rootDir, '');
  
  return {
    // Tell Vite where to look for .env files
    envDir: rootDir,
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/auth": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "shared": path.resolve(__dirname, "../shared/src"),
      },
    },
  };
});
