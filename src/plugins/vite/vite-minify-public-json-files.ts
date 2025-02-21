import path from "path";
import fs from "fs";
import { type Logger, type Plugin as VitePlugin } from "vite";
import chalk from "chalk";

//#region Constants

const NAME = "minify-public-json-files";
const VERSION = "2.0.1";

//#endregion

/**
 * Plugin to minify json files in the `public/` directory.
 */
export function minifyPublicJsonFiles(): VitePlugin {
  let logger: Logger;
  let count = 0;
  const errors: Error[] = [];
  const { cyan, gray, red, yellow, green } = chalk;

  return {
    name: NAME,
    version: VERSION,
    apply: "build",
    enforce: "post", //run after other plugins/stuff
    configResolved(resolvedConfig) {
      logger = resolvedConfig.logger;
    },
    buildStart() {
      logger.info(cyan(`\t→ Plugin: ${NAME} v${VERSION}`));
    },
    async generateBundle(options, _bundle) {
      function minifyJsonFiles(dir: string, outputDir: string) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const fullPath = path.join(dir, file);
          const outputFilePath = path.join(outputDir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            // Recurse into subdirectories
            const nestedOutputDir = path.join(outputDir, file);
            fs.mkdirSync(nestedOutputDir, { recursive: true });
            minifyJsonFiles(fullPath, nestedOutputDir);
          } else if (file.endsWith(".json")) {
            try {
              // Minify JSON file
              const content = fs.readFileSync(fullPath, "utf-8");
              const minifiedContent = JSON.stringify(JSON.parse(content));
              fs.writeFileSync(outputFilePath, minifiedContent, "utf-8");
              count++;
            } catch (err) {
              fs.copyFileSync(fullPath, outputFilePath);
              const error = new Error(`Failed to minify JSON file: ${fullPath}\n\t→ ${err.message}`);
              error.stack = err.stack;
              errors.push(error);
            }
          } else {
            // Copy other files as-is
            fs.copyFileSync(fullPath, outputFilePath);
          }
        }
      }

      const publicDir = path.resolve("./public");
      const outputDir = path.resolve(options.dir || "dist");

      minifyJsonFiles(publicDir, outputDir);
    },
    closeBundle() {
      const logSuffix = gray(` [${NAME}]`);

      if (count > 0) {
        const failedMsg = errors.length > 0 ? yellow(` (${errors.length} failed)`) : "";

        logger.info(`${green(`✓ Minified ${count} JSON files successfully`)}${failedMsg}${logSuffix}`);
      }

      if (errors.length > 0) {
        errors.map((error) => logger.error(`${red(error.message)}${logSuffix}`, { error }));
      }
    },
  };
}
