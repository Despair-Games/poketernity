import { defineConfig, loadEnv, type Rollup, type UserConfig } from "vite";
import ViteTsconfigPaths from "vite-tsconfig-paths";
import { gitBranchPlugin as ViteGitBranchPlugin } from "./src/plugins/vite/vite-git-branch";
import { minifyPublicJsonFiles as ViteMinifyPublicJsonFiles } from "./src/plugins/vite/vite-minify-public-json-files";

export const defaultConfig: UserConfig = {
  plugins: [ViteTsconfigPaths(), ViteMinifyPublicJsonFiles()],
  clearScreen: false,
  appType: "mpa",
  build: {
    chunkSizeWarningLimit: 10000,
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      // biome-ignore lint/nursery/noShadow: This matches Vite itself
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
    plugins: [...(defaultConfig.plugins ?? []), mode === "development" ? ViteGitBranchPlugin() : null],
    base: "",
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
      keepNames: true,
    },
    server: {
      port: Number.isNaN(envPort) ? 8000 : envPort,
    },
  };
});
