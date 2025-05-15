import { calcAccuracyMultiplier, clamp } from "#utils/common-utils";
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

  describe("calcAccuracyMultiplier", () => {
    it("should not be less than 3/9", () => {
      const actual = calcAccuracyMultiplier(-6, 6);
      expect(actual).toBe(3 / 9);
    });

    it("should not be more than 9/3", () => {
      const actual = calcAccuracyMultiplier(6, -6);
      expect(actual).toBe(9 / 3);
    });

    it("should return 3/9 for a difference of -6", () => {
      const actual = calcAccuracyMultiplier(-6, 0);
      expect(actual).toBe(3 / 9);
    });

    it("should return 3/8 for a difference of -5", () => {
      const actual = calcAccuracyMultiplier(-5, 0);
      expect(actual).toBe(3 / 8);
    });

    it("should return 3/7 for a difference of -4", () => {
      const actual = calcAccuracyMultiplier(-4, 0);
      expect(actual).toBe(3 / 7);
    });

    it("should return 3/6 for a difference of -3", () => {
      const actual = calcAccuracyMultiplier(-3, 0);
      expect(actual).toBe(3 / 6);
    });

    it("should return 3/5 for a difference of -2", () => {
      const actual = calcAccuracyMultiplier(-2, 0);
      expect(actual).toBe(3 / 5);
    });

    it("should return 3/4 for a difference of -1", () => {
      const actual = calcAccuracyMultiplier(-1, 0);
      expect(actual).toBe(3 / 4);
    });

    it("should return 3/3 for a difference of 0", () => {
      const actual = calcAccuracyMultiplier(0, 0);
      expect(actual).toBe(3 / 3);
    });

    it("should return 4/3 for a difference of +1", () => {
      const actual = calcAccuracyMultiplier(1, 0);
      expect(actual).toBe(4 / 3);
    });

    it("should return 5/3 for a difference of +2", () => {
      const actual = calcAccuracyMultiplier(2, 0);
      expect(actual).toBe(5 / 3);
    });

    it("should return 6/3 for a difference of +3", () => {
      const actual = calcAccuracyMultiplier(3, 0);
      expect(actual).toBe(6 / 3);
    });

    it("should return 7/3 for a difference of +4", () => {
      const actual = calcAccuracyMultiplier(4, 0);
      expect(actual).toBe(7 / 3);
    });

    it("should return 8/3 for a difference of +5", () => {
      const actual = calcAccuracyMultiplier(5, 0);
      expect(actual).toBe(8 / 3);
    });

    it("should return 9/3 for a difference of +6", () => {
      const actual = calcAccuracyMultiplier(6, 0);
      expect(actual).toBe(9 / 3);
    });
  });
});
