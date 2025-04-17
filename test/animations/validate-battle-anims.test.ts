import { animConfigSchema } from "#app/data/animations/anim-config-schema";
import Ajv from "ajv";
import { readdirSync, readFileSync } from "fs";
import { describe, expect, it } from "vitest";

describe("Animations - BattleAnim Validation", () => {
  it.skip("All battle animations fit the AnimConfig schema", async () => {
    const baseDir = "./public/battle-anims/";
    const fileNames = readdirSync(baseDir).filter((file) => file.match(/\.json$/));
    const ajv = new Ajv({
      allErrors: true,
      allowUnionTypes: true,
    });
    const validate = ajv.compile(animConfigSchema);

    fileNames.forEach((fileName: string) => {
      const data = JSON.parse(readFileSync(baseDir + fileName, "utf8"));
      const result = validate(data);

      expect(result, `${fileName}: ${validate.errors?.map((err) => err.message)}`).toBeTruthy();
    });
  });
});
