import type { AnimConfig } from "#app/data/anim-config";
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
