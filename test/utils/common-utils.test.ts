import { clamp } from "#app/utils/common-utils";
import { describe, expect, it } from "vitest";

describe("Utils - Common Utils", () => {
  describe("clamp", () => {
    const min = -5;
    const max = 5;

    it("should not be more than max", () => {
      const actual = clamp(10, min, max);
      expect(actual).toBe(max);
    });

    it("should not be less than min", () => {
      const actual = clamp(-10, min, max);
      expect(actual).toBe(min);
    });

    it.each([-3, 0, 3])("should not alter values between min and max (%i)", (value) => {
      const actual = clamp(value, min, max);
      expect(actual).toBe(value);
    });
  });
});
