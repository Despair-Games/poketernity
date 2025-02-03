import { legacyCompatibleImages, windowTypeDependantAtlases as windowTypeDependantAtlases } from "#app/scene-base";
import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { WindowVariant } from "#enums/window-variant";
import { CANVAS_SCALE } from "#app/ui-constants";
import { UiTheme } from "#enums/ui-theme";
import type { UiWindowType } from "#enums/ui-window-type";

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
  windowVariant?: WindowVariant,
): Phaser.GameObjects.NineSlice {
  if (windowVariant === undefined) {
    windowVariant = WindowVariant.NORMAL;
  }

  const borderSize = 6;

  const window = globalScene.add.nineslice(
    x,
    y,
    `window${getWindowVariantSuffix(windowVariant)}`,
    settings.display.uiWindowType,
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

export function updateWindowType(windowType: UiWindowType): void {
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
      && windowTypeDependantAtlases.includes(object.texture?.key)
    ) {
      object.setFrame(windowType);
    }
  };

  traverse(globalScene);
}

export function addUiThemeOverrides(): void {
  const originalAddImage = globalScene.add.image;
  globalScene.add.image = function (
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
  ): Phaser.GameObjects.Image {
    let legacy = false;
    if (
      typeof texture === "string"
      && settings.display.uiTheme === UiTheme.LEGACY
      && legacyCompatibleImages.includes(texture)
    ) {
      legacy = true;
      texture += "_legacy";
    }
    const ret: Phaser.GameObjects.Image = originalAddImage.apply(this, [x, y, texture, frame]);
    if (legacy) {
      const originalSetTexture = ret.setTexture;
      ret.setTexture = function (key: string, frame?: string | number) {
        key += "_legacy";
        return originalSetTexture.apply(this, [key, frame]);
      };
    }
    return ret;
  };

  const originalAddSprite = globalScene.add.sprite;
  globalScene.add.sprite = function (
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
  ): Phaser.GameObjects.Sprite {
    let legacy = false;
    if (
      typeof texture === "string"
      && settings.display.uiTheme === UiTheme.LEGACY
      && legacyCompatibleImages.includes(texture)
    ) {
      legacy = true;
      texture += "_legacy";
    }
    const ret: Phaser.GameObjects.Sprite = originalAddSprite.apply(this, [x, y, texture, frame]);
    if (legacy) {
      const originalSetTexture = ret.setTexture;
      ret.setTexture = function (key: string, frame?: string | number) {
        key += "_legacy";
        return originalSetTexture.apply(this, [key, frame]);
      };
    }
    return ret;
  };

  const originalAddNineslice = globalScene.add.nineslice;
  globalScene.add.nineslice = function (
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
    width?: number,
    height?: number,
    leftWidth?: number,
    rightWidth?: number,
    topHeight?: number,
    bottomHeight?: number,
  ): Phaser.GameObjects.NineSlice {
    let legacy = false;
    if (
      typeof texture === "string"
      && settings.display.uiTheme === UiTheme.LEGACY
      && legacyCompatibleImages.includes(texture)
    ) {
      legacy = true;
      texture += "_legacy";
    }
    const ret: Phaser.GameObjects.NineSlice = originalAddNineslice.apply(this, [
      x,
      y,
      texture,
      frame,
      width,
      height,
      leftWidth,
      rightWidth,
      topHeight,
      bottomHeight,
    ]);
    if (legacy) {
      const originalSetTexture = ret.setTexture;
      ret.setTexture = function (
        key: string | Phaser.Textures.Texture,
        frame?: string | number,
        updateSize?: boolean,
        updateOrigin?: boolean,
      ) {
        key += "_legacy";
        return originalSetTexture.apply(this, [key, frame, updateSize, updateOrigin]);
      };
    }
    return ret;
  };
}
