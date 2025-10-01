import { arrayOfRange } from "#test/test-utils/test-utils";
import { calcAccuracyMultiplier, clamp, wrap } from "#utils/common-utils";
import { describe, expect, it } from "vitest";

describe("Utils - Common Utils", () => {
  describe("clamp", () => {
    const min = -5;
    const max = 5;
    const range = arrayOfRange(min, max);

    it("should not be more than max", () => {
      const actual = clamp(10, min, max);
      expect(actual).toBe(max);
    });

    it("should not be less than min", () => {
      const actual = clamp(-10, min, max);
      expect(actual).toBe(min);
    });

    it.each(range)("should not alter values between min and max (%i)", (value) => {
      const actual = clamp(value, min, max);
      expect(actual).toBe(value);
    });

    it("should not accept `min > max`", () => {
      expect(() => clamp(0, 5, -5)).toThrowError();
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

  describe("wrap", () => {
    const inputs: number[] = [
      -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];
    // -10 to -5
    const outputsA: number[] = [
      -8, -7, -6, -5, -10, -9, -8, -7, -6, -5, -10, -9, -8, -7, -6, -5, -10, -9, -8, -7, -6, -5, -10, -9, -8, -7, -6,
      -5, -10, -9, -8, -7, -6, -5, -10, -9, -8, -7, -6, -5, -10,
    ];
    // -5 to 0
    const outputsB: number[] = [
      -2, -1, 0, -5, -4, -3, -2, -1, 0, -5, -4, -3, -2, -1, 0, -5, -4, -3, -2, -1, 0, -5, -4, -3, -2, -1, 0, -5, -4, -3,
      -2, -1, 0, -5, -4, -3, -2, -1, 0, -5, -4,
    ];
    // 0 to 5
    const outputsC: number[] = [
      4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
      0, 1, 2,
    ];
    // 5 to 10
    const outputsD: number[] = [
      10, 5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9,
      10, 5, 6, 7, 8,
    ];
    // -3 to 3
    const outputsE: number[] = [
      1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2,
      -1, 0, 1, 2, 3, -3, -2, -1,
    ];

    it.each<{ input: number[]; output: number[]; min: number; max: number }>([
      { input: inputs, output: outputsA, min: -10, max: -5 },
      { input: inputs, output: outputsB, min: -5, max: 0 },
      { input: inputs, output: outputsC, min: 0, max: 5 },
      { input: inputs, output: outputsD, min: 5, max: 10 },
      { input: inputs, output: outputsE, min: -3, max: 3 },
    ])("should wrap the given value between $min and $max (inclusive)", ({ input, output, min, max }) => {
      expect(input.length).toBe(output.length);
      input.forEach((val, idx) => expect(wrap(val, min, max)).toBe(output[idx]));
    });

    it("should throw an error if min > max", () => {
      expect(() => wrap(0, 5, 0)).toThrowError();
    });
  });
});
