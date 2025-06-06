import chalk from "chalk";
import { execSync } from "node:child_process";
import type { Plugin } from "vite";

//#region Constants

const NAME = "git-branch";

//#endregion

/**
 * A Vite plugin that adds the current git branch name to the `import.meta.env.VITE_GIT_BRANCH` variable.
 * @returns The Vite plugin
 */
export function gitBranchPlugin(): Plugin {
  const { gray, red, cyan } = chalk;
  const logSuffix = gray(` [${NAME}]`);

  return {
    name: NAME,
    config(_config) {
      let branch = "UNKNOWN";

      try {
        branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
      } catch (e) {
        console.warn(red(" Failed to get git branch:") + logSuffix, e);
      }

      console.log(`${cyan(`✓ Adding "VITE_GIT_BRANCH" env variable (="${branch}")`)}${logSuffix}`);

      return {
        define: {
          "import.meta.env.VITE_GIT_BRANCH": JSON.stringify(branch),
        },
      };
    },
  };
}
