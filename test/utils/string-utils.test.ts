import { leftPad } from "#utils/string-utils";
import { describe, expect, it } from "vitest";

describe("Utils - String Utils", () => {
  describe("leftPad", () => {
    it("should return a string", () => {
      const result = leftPad(1, 10);
      expect(typeof result).toBe("string");
    });

    it("should return a padded result with default padWith", () => {
      const result = leftPad(1, 3);
      expect(result).toBe("001");
    });

    it("should return a padded result using a custom padWith", () => {
      const result = leftPad(1, 10, "yes");
      expect(result).toBe("yesyesyes1");
    });

    it("should return inputted value when zero length is entered", () => {
      const result = leftPad(1, 0);
      expect(result).toBe("1");
    });
  });
});
