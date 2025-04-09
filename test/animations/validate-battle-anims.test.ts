import { animConfigSchema } from "#app/data/animations/anim-config-schema";
import { readdirSync, readFileSync } from "fs";
import { Validator } from "jsonschema";
import { describe, expect, it } from "vitest";

describe("Animations - BattleAnim Validation", () => {
  it.skip("All battle animations fit the AnimConfig schema", async () => {
    const baseDir = "./public/battle-anims/";
    const fileNames = readdirSync(baseDir).filter((file) => file.match(/\.json$/));
    const validator = new Validator();

    fileNames.forEach((fileName: string) => {
      const data = JSON.parse(readFileSync(baseDir + fileName, "utf8"));
      const result = validator.validate(data, animConfigSchema);

      expect(result.valid, `${fileName}: ${result.errors[0]?.toString() ?? ""}`).toBeTruthy();
    });
  });
});
