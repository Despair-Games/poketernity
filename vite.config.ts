import { defineConfig, loadEnv, Rollup, UserConfig } from "vite";
import ViteTsconfigPaths from "vite-tsconfig-paths";
import { minifyPublicJsonFiles as ViteMinifyPublicJsonFiles } from "./src/plugins/vite/vite-minify-json-plugin";

export const defaultConfig: UserConfig = {
  plugins: [ViteTsconfigPaths(), ViteMinifyPublicJsonFiles()],
  clearScreen: false,
  appType: "mpa",
  build: {
    chunkSizeWarningLimit: 10000,
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      onwarn(warning: Rollup.RollupLog, defaultHandler: (warning: string | Rollup.RollupLog) => void) {
        // Suppress "Module level directives cause errors when bundled" warnings
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
};

export default defineConfig(({ mode }) => {
  const envPort = Number(loadEnv(mode, process.cwd()).VITE_PORT);

  return {
    ...defaultConfig,
    base: "",
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
      keepNames: true,
    },
    server: {
      port: !isNaN(envPort) ? envPort : 8000,
    },
  };
});
