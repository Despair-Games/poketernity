import { beforeAll, describe, expect, it } from "vitest";

import { isLandscapeMode } from "#app/utils/app-utils";
import Phaser from "phaser";

describe("Utils - App Utils", () => {
  let phaserGame: Phaser.Game;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  describe("isLandscapeMode", () => {
    it.each([
      { label: "Landscape", id: Phaser.Scale.Orientation.LANDSCAPE },
      { label: "Landscape Secondary", id: Phaser.Scale.Orientation.LANDSCAPE_SECONDARY },
    ])("should return true if orientation is $label", ({ id }) => {
      phaserGame.scale.orientation = id;
      const actualresult = isLandscapeMode(phaserGame);
      expect(actualresult).toBe(true);
    });

    it.each([
      { label: "Portrait", id: Phaser.Scale.Orientation.PORTRAIT },
      { label: "Portrait Secondary", id: Phaser.Scale.Orientation.PORTRAIT_SECONDARY },
    ])("should return false if orientation is $label", ({ id }) => {
      phaserGame.scale.orientation = id;
      const actualresult = isLandscapeMode(phaserGame);
      expect(actualresult).toBe(false);
    });
  });
});
