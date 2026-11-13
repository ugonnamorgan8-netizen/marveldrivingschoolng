import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Dev only: serve the Vercel-style functions in /api through the Vite dev server,
 * so forms and analytics work on localhost exactly as they do on Vercel.
 */
const devApi = (): Plugin => ({
  name: "dev-api-functions",
  apply: "serve",
  configureServer(server: ViteDevServer) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url || "";
      const match = url.match(/^\/api\/([a-z0-9-]+)(?:\?.*)?$/i);
      if (!match) return next();
      try {
        const mod = await server.ssrLoadModule(path.resolve(__dirname, "api", `${match[1]}.js`));
        await mod.default(req, res);
      } catch (e) {
        if ((e as { code?: string }).code === "ERR_LOAD_URL" || /Failed to load url/.test(String(e))) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        console.error(e);
        res.statusCode = 500;
        res.end("Internal error");
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "development") {
    // Make server-only secrets from .env available to the dev API functions.
    // (Never exposed to the browser: only VITE_* variables reach client code.)
    Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  }

  return {
    server: {
      // localhost only. To test on a phone on the same Wi-Fi: `npm run dev -- --host`
      host: "localhost",
      port: 8080,
    },
    preview: {
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger(), mode === "development" && devApi()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      // Production builds ship without console output or debugger statements.
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            supabase: ["@supabase/supabase-js"],
          },
        },
      },
    },
  };
});
