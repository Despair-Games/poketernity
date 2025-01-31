import { allMoves } from "#app/data/all-moves";
import { AnimConfig, chargeAnims, moveAnims } from "#app/data/battle-anims";
import { BeakBlastHeaderAttr } from "#app/data/move-attrs/beak-blast-header-attr";
import { DelayedAttackAttr } from "#app/data/move-attrs/delayed-attack-attr";
import { globalScene } from "#app/global-scene";
import type { Moves } from "#enums/moves";
import Phaser from "phaser";

//#region Exports

export function loadMoveAnimAssets(moveIds: Moves[], startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    const moveAnimations = moveIds.map((m) => moveAnims.get(m) as AnimConfig).flat();
    for (const moveId of moveIds) {
      const chargeAnimSource = allMoves[moveId].isChargingMove()
        ? allMoves[moveId]
        : (allMoves[moveId].getAttrs(DelayedAttackAttr)[0] ?? allMoves[moveId].getAttrs(BeakBlastHeaderAttr)[0]);
      if (chargeAnimSource) {
        const moveChargeAnims = chargeAnims.get(chargeAnimSource.chargeAnim);
        moveAnimations.push(moveChargeAnims instanceof AnimConfig ? moveChargeAnims : moveChargeAnims![0]); // TODO: is the bang correct?
        if (Array.isArray(moveChargeAnims)) {
          moveAnimations.push(moveChargeAnims[1]);
        }
      }
    }
    loadAnimAssets(moveAnimations, startLoad).then(() => resolve());
  });
}

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

//#endregion
