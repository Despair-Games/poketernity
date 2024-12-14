import { defineWorkspace } from "vitest/config";
import { defaultConfig } from "./vite.config";

export default defineWorkspace([
  {
    ...defaultConfig,
  },
  "./vitest.config.ts",
]);
