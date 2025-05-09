import { isLandscapeMode } from "#utils/app-utils";
import Phaser from "phaser";
import { describe, expect, it } from "vitest";

describe("Utils - App Utils", () => {
  describe("isLandscapeMode", () => {
    it.each([
      { label: "Landscape", id: Phaser.Scale.Orientation.LANDSCAPE },
      { label: "Landscape Secondary", id: Phaser.Scale.Orientation.LANDSCAPE_SECONDARY },
    ])("should return true if orientation is $label", ({ id }) => {
      const sceneMock = { scale: { orientation: id } as Phaser.Scale.ScaleManager };

      const actualresult = isLandscapeMode(sceneMock);

      expect(actualresult).toBe(true);
    });

    it.each([
      { label: "Portrait", id: Phaser.Scale.Orientation.PORTRAIT },
      { label: "Portrait Secondary", id: Phaser.Scale.Orientation.PORTRAIT_SECONDARY },
    ])("should return false if orientation is $label", ({ id }) => {
      const sceneMock = { scale: { orientation: id } as Phaser.Scale.ScaleManager };
      const actualresult = isLandscapeMode(sceneMock);

      expect(actualresult).toBe(false);
    });
  });
});
