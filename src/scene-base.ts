// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UiTheme } from "#enums/ui-theme";
import { UiWindowStyle } from "#enums/ui-window-style";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { getLocalizedFilename } from "#app/utils";
import { settings } from "#app/system/settings/settings-manager";
import { ImagesFolder } from "#enums/images-folders";
import { windowStyleDependantAtlases } from "#app/ui/ui-theme";

/**
 * Additional parameters that can be used when loading Images, Spritesheets or Atlases.
 * They allow to automatically handle textures with a file for each language,
 * atlases/spritesheets that need to be updated live when the {@linkcode UiWindowStyle} is changed
 * and UI elements that depend on the current {@linkcode UiTheme}.
 */
interface TextureLoadingOptions {
  /**
   * Optional filename, without the extension. Allows to use a texture key different from the name of the file to load.
   */
  filenameRoot?: string;
  /**
   * If provided, the languageKey will be checked for compatibility with localized images, or be replaced with "en".
   * In this case, `_{languageKey}` will be appended to the filename before loading, e.g. "banner_zh-CW.png".
   */
  languageKey?: string;
  /**
   * If set to `true`, will automatically update any object using this texture when the window style is changed.
   * Only works for atlases with keys corresponding to each {@linkcode UiWindowStyle} (starting at "0"), or spritesheets.
   */
  windowStyleDependant?: boolean;
  /**
   * If set to `true`, will load the filename corresponding to the current {@linkcode UiTheme} (and not the other themes).
   * Elements that use these need to have `-{uitheme}` at the end of their filename, e.g. "window-dark.png", for each theme.
   * This is applied before any language specific postfix (e.g. "image-dark_de.png" is correct, "image_de-dark.png" is not).
   */
  uiThemeDependant?: boolean;
}

export class SceneBase extends Phaser.Scene {
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

  loadImage(key: string, imageFolder: ImagesFolder = ImagesFolder.ROOT, options?: TextureLoadingOptions) {
    const folder = imageFolder !== ImagesFolder.ROOT ? imageFolder + "/" : "";
    const filenameRoot = options ? this.getFilenameRoot(key, options) : key;
    this.load.image(key, this.getCachedUrl(`images/${folder}${filenameRoot}.png`));
  }

  loadSpritesheet(
    key: string,
    imageFolder: ImagesFolder,
    width: number,
    height?: number,
    options?: TextureLoadingOptions,
  ) {
    if (options?.windowStyleDependant && !windowStyleDependantAtlases.includes(key)) {
      windowStyleDependantAtlases.push(key);
    }
    const folder = imageFolder !== ImagesFolder.ROOT ? imageFolder + "/" : "";
    const filenameRoot = options ? this.getFilenameRoot(key, options) : key;
    this.load.spritesheet(key, this.getCachedUrl(`images/${folder}${filenameRoot}.png`), {
      frameWidth: width,
      frameHeight: height ?? width,
    });
  }

  loadAtlas(key: string, imageFolder: ImagesFolder = ImagesFolder.ROOT, options?: TextureLoadingOptions) {
    if (options?.windowStyleDependant && !windowStyleDependantAtlases.includes(key)) {
      windowStyleDependantAtlases.push(key);
    }
    const folder = imageFolder !== ImagesFolder.ROOT ? imageFolder + "/" : "";
    const atlasFilenameRoot = options?.filenameRoot ?? key;
    const imageFilenameRoot = options ? this.getFilenameRoot(key, options) : key;
    this.load.atlas(
      key,
      this.getCachedUrl(`images/${folder}${imageFilenameRoot}.png`),
      this.getCachedUrl(`images/${folder}${atlasFilenameRoot}.json`),
    );
  }

  private getFilenameRoot(key: string, params: TextureLoadingOptions) {
    let filenameRoot = params.filenameRoot ?? key;
    if (params.uiThemeDependant) {
      filenameRoot += "-" + UiTheme[settings.display.uiTheme].toLowerCase();
    }
    if (params.languageKey) {
      filenameRoot = getLocalizedFilename(filenameRoot, params.languageKey);
    }
    return filenameRoot;
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
}
