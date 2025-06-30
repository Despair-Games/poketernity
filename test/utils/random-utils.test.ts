import { randomString } from "#utils/random-utils";
import Phaser from "phaser";
import { beforeAll, describe, expect, it } from "vitest";

describe("Utils - Random Utils", () => {
  beforeAll(() => {
    new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  describe("randomString", () => {
    it("should return a string of the specified length", () => {
      const str = randomString(10);
      expect(str.length).toBe(10);
    });

    it("should work with seed", () => {
      const state = Phaser.Math.RND.state();
      const str1 = randomString(10, true);
      Phaser.Math.RND.state(state);
      const str2 = randomString(10, true);

      expect(str1).toBe(str2);
    });
  });
});
