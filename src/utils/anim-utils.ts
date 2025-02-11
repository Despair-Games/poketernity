// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type initCommonAnims } from "#app/data/init-common-anims";
import { type initEncounterAnims } from "#app/data/init-encounter-anims";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --
import type { AnimConfig } from "#app/data/anim-config";
import { commonAnims } from "#app/data/common-anims";
import { encounterAnims } from "#app/data/encounter-anims";
import { globalScene } from "#app/global-scene";
import Phaser from "phaser";

export function loadAnimAssets(anims: AnimConfig[], startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    const backgrounds = new Set<string>();
    const sounds = new Set<string>();
    for (const a of anims) {
      if (!a.frames?.length) {
        continue;
      }
      const animSounds = a.getSoundResourceNames();
      for (const ms of animSounds) {
        sounds.add(ms);
      }
      const animBackgrounds = a.getBackgroundResourceNames();
      for (const abg of animBackgrounds) {
        backgrounds.add(abg);
      }
      if (a.graphic) {
        globalScene.loadSpritesheet(a.graphic, "battle_anims", 96);
      }
    }
    for (const bg of backgrounds) {
      globalScene.loadImage(bg, "battle_anims");
    }
    for (const s of sounds) {
      globalScene.loadSe(s, "battle_anims", s);
    }
    if (startLoad) {
      globalScene.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
      if (!globalScene.load.isLoading()) {
        globalScene.load.start();
      }
    } else {
      resolve();
    }
  });
}

/**
 * Loads common animation assets to scene.
 *
 * **Must** be called after {@linkcode initCommonAnims} to load all required animations properly.
 * @param startLoad
 * @returns
 */
export function loadCommonAnimAssets(startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    loadAnimAssets(Array.from(commonAnims.values()), startLoad).then(() => resolve());
  });
}

/**
 * Loads encounter animation assets to scene
 *
 * **MUST** be called after {@linkcode initEncounterAnims} to load all required animations properly
 * @param startLoad
 */
export async function loadEncounterAnimAssets(startLoad?: boolean): Promise<void> {
  await loadAnimAssets(Array.from(encounterAnims.values()), startLoad);
}
