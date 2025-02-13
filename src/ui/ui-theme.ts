import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { WindowVariant } from "#enums/window-variant";
import { CANVAS_SCALE } from "#app/ui-constants";
import type { UiWindowStyle } from "#enums/ui-window-style";

/**
 * Texture keys of atlases that need to be updated when the {@linkcode UiWindowStyle} changes.
 */
export const windowStyleDependantAtlases: string[] = [];

export function getWindowVariantSuffix(windowVariant: WindowVariant): string {
  switch (windowVariant) {
    case WindowVariant.THIN:
      return "_thin";
    case WindowVariant.XTHIN:
      return "_xthin";
    default:
      return "";
  }
}

export function addWindow(
  x: number,
  y: number,
  width: number,
  height: number,
  mergeMaskTop?: boolean,
  mergeMaskLeft?: boolean,
  maskOffsetX?: number,
  maskOffsetY?: number,
  windowVariant: WindowVariant = WindowVariant.NORMAL,
): Phaser.GameObjects.NineSlice {
  const borderSize = 6;

  const window = globalScene.add.nineslice(
    x,
    y,
    `window${getWindowVariantSuffix(windowVariant)}`,
    settings.display.uiWindowStyle,
    width,
    height,
    borderSize,
    borderSize,
    borderSize,
    borderSize,
  );
  window.setOrigin(0, 0);

  if (mergeMaskLeft || mergeMaskTop || maskOffsetX || maskOffsetY) {
    /**
     * x: left
     * y: top
     * width: right
     * height: bottom
     */
    const maskRect = new Phaser.GameObjects.Rectangle(
      globalScene,
      CANVAS_SCALE * (x - (mergeMaskLeft ? 2 : 0) - (maskOffsetX || 0)),
      CANVAS_SCALE * (y + (mergeMaskTop ? 2 : 0) + (maskOffsetY || 0)),
      width - (mergeMaskLeft ? 2 : 0),
      height - (mergeMaskTop ? 2 : 0),
      0xffffff,
    );
    maskRect.setOrigin(0);
    maskRect.setScale(CANVAS_SCALE);
    const mask = maskRect.createGeometryMask();
    window.setMask(mask);
  }

  return window;
}

export function updateWindowStyle(windowStyle: UiWindowStyle): void {
  const traverse = (object: any) => {
    if (object.hasOwnProperty("children") && object.children instanceof Phaser.GameObjects.DisplayList) {
      const children = object.children as Phaser.GameObjects.DisplayList;
      for (const child of children.getAll()) {
        traverse(child);
      }
    } else if (object instanceof Phaser.GameObjects.Container) {
      for (const child of object.getAll()) {
        traverse(child);
      }
    } else if (
      (object instanceof Phaser.GameObjects.NineSlice
        || object instanceof Phaser.GameObjects.Image
        || object instanceof Phaser.GameObjects.Sprite)
      && windowStyleDependantAtlases.includes(object.texture?.key)
    ) {
      object.setFrame(windowStyle);
    }
  };

  traverse(globalScene);
}
