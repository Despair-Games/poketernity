import { WindowVariant } from "./ui/ui-theme";
import { globalScene } from "./global-scene";
import { getWindowVariantSuffix } from "./ui/ui-theme";
import type { TextStyle } from "./ui/text";
import i18next from "i18next";
import { getTextStyleOptions } from "./ui/text";

export const legacyCompatibleImages: string[] = [];

export class SceneBase extends Phaser.Scene {
  /**
   * Since everything is scaled up by 6 by default using the game.canvas is annoying
   * Until such point that we use the canvas normally, this will be easier than
   * having to divide every width and heigh by 6 to position and scale the ui
   * @readonly
   * @defaultValue
   * width: `320`
   * height: `180`
   */
  public readonly scaledCanvas = {
    width: 1920 / 6,
    height: 1080 / 6,
  };
  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  getCachedUrl(url: string): string {
    const manifest = this.game["manifest"];
    if (manifest) {
      const timestamp = manifest[`/${url}`];
      if (timestamp) {
        url += `?t=${timestamp}`;
      }
    }
    return url;
  }

  loadImage(key: string, folder: string, filename?: string) {
    if (!filename) {
      filename = `${key}.png`;
    }
    this.load.image(key, this.getCachedUrl(`images/${folder}/${filename}`));
    if (folder.startsWith("ui")) {
      legacyCompatibleImages.push(key);
      folder = folder.replace("ui", "ui/legacy");
      this.load.image(`${key}_legacy`, this.getCachedUrl(`images/${folder}/${filename}`));
    }
  }

  loadSpritesheet(key: string, folder: string, size: number, filename?: string) {
    if (!filename) {
      filename = `${key}.png`;
    }
    this.load.spritesheet(key, this.getCachedUrl(`images/${folder}/${filename}`), {
      frameWidth: size,
      frameHeight: size,
    });
    if (folder.startsWith("ui")) {
      legacyCompatibleImages.push(key);
      folder = folder.replace("ui", "ui/legacy");
      this.load.spritesheet(`${key}_legacy`, this.getCachedUrl(`images/${folder}/${filename}`), {
        frameWidth: size,
        frameHeight: size,
      });
    }
  }

  loadAtlas(key: string, folder: string, filenameRoot?: string) {
    if (!filenameRoot) {
      filenameRoot = key;
    }
    if (folder) {
      folder += "/";
    }
    this.load.atlas(
      key,
      this.getCachedUrl(`images/${folder}${filenameRoot}.png`),
      this.getCachedUrl(`images/${folder}${filenameRoot}.json`),
    );
    if (folder.startsWith("ui")) {
      legacyCompatibleImages.push(key);
      folder = folder.replace("ui", "ui/legacy");
      this.load.atlas(
        `${key}_legacy`,
        this.getCachedUrl(`images/${folder}${filenameRoot}.png`),
        this.getCachedUrl(`images/${folder}${filenameRoot}.json`),
      );
    }
  }

  loadSe(key: string, folder?: string, filenames?: string | string[]) {
    if (!filenames) {
      filenames = `${key}.wav`;
    }
    if (!folder) {
      folder = "se/";
    } else {
      folder += "/";
    }
    if (!Array.isArray(filenames)) {
      filenames = [filenames];
    }
    for (const f of filenames as string[]) {
      this.load.audio(folder + key, this.getCachedUrl(`audio/${folder}${f}`));
    }
  }

  loadBgm(key: string, filename?: string) {
    if (!filename) {
      filename = `${key}.mp3`;
    }
    this.load.audio(key, this.getCachedUrl(`audio/bgm/${filename}`));
  }

  /**
   * Adds a window to the scene object
   * Notes: Should be moved to a UI-specific scene object in the future. Various related, helper methods found in ui-theme.ts
   * @param x
   * @param y
   * @param width
   * @param height
   * @param mergeMaskTop
   * @param mergeMaskLeft
   * @param maskOffsetX
   * @param maskOffsetY
   * @param windowVariant
   * @returns a reference to a Phaser NineSlice object
   */
  addWindow(
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

    const borderSize = globalScene.uiTheme ? 6 : 8;

    const window = this.add.nineslice(
      x,
      y,
      `window_${globalScene.windowType}${getWindowVariantSuffix(windowVariant)}`,
      undefined,
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
        6 * (x - (mergeMaskLeft ? 2 : 0) - (maskOffsetX || 0)),
        6 * (y + (mergeMaskTop ? 2 : 0) + (maskOffsetY || 0)),
        width - (mergeMaskLeft ? 2 : 0),
        height - (mergeMaskTop ? 2 : 0),
        0xffffff,
      );
      maskRect.setOrigin(0);
      maskRect.setScale(6);
      const mask = maskRect.createGeometryMask();
      window.setMask(mask);
    }
    return window;
  }

  /**
   * Adds a Phaser text object to the scene
   * @param x
   * @param y
   * @param content
   * @param style
   * @param extraStyleOptions
   * @returns reference to the created Phaser text object
   */
  addTextObject(
    x: number,
    y: number,
    content: string,
    style: TextStyle,
    extraStyleOptions?: Phaser.Types.GameObjects.Text.TextStyle,
  ): Phaser.GameObjects.Text {
    const { scale, styleOptions, shadowColor, shadowXpos, shadowYpos } = getTextStyleOptions(
      style,
      globalScene.uiTheme,
      extraStyleOptions,
    );

    const ret = this.add.text(x, y, content, styleOptions);
    ret.setScale(scale);
    ret.setShadow(shadowXpos, shadowYpos, shadowColor);
    if (!(styleOptions as Phaser.Types.GameObjects.Text.TextStyle).lineSpacing) {
      ret.setLineSpacing(scale * 30);
    }

    if (ret.lineSpacing < 12 && i18next.resolvedLanguage === "ja") {
      ret.setLineSpacing(ret.lineSpacing + 35);
    }

    return ret;
  }
}
