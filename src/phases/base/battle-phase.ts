import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { TrainerSlot } from "#enums/trainer-slot";

/**
 * Adds functions to display and hide the enemy trainer
 */
export abstract class BattlePhase extends Phase {
  public showEnemyTrainer(trainerSlot: TrainerSlot = TrainerSlot.NONE): void {
    const { trainer } = globalScene.currentBattle;
    if (!trainer) {
      console.warn("Enemy trainer is missing!");
      return;
    }
    const sprites = trainer.getSprites();
    const tintSprites = trainer.getTintSprites();
    for (let i = 0; i < sprites.length; i++) {
      const visible = !trainerSlot || !i === (trainerSlot === TrainerSlot.TRAINER) || sprites.length < 2;
      [sprites[i], tintSprites[i]].forEach((sprite) => {
        if (visible) {
          let xOffset = -16;
          if (trainerSlot || sprites.length < 2) {
            xOffset = 0;
          } else if (i) {
            xOffset = 16;
          }
          sprite.x = xOffset;
        }
        sprite.setVisible(visible);
        sprite.clearTint();
      });
    }
    globalScene.tweens.add({
      targets: trainer,
      x: "-=16",
      y: "+=16",
      alpha: 1,
      ease: "Sine.easeInOut",
      duration: 750,
    });
  }

  public hideEnemyTrainer(): void {
    globalScene.tweens.add({
      targets: globalScene.currentBattle.trainer,
      x: "+=16",
      y: "-=16",
      alpha: 0,
      ease: "Sine.easeInOut",
      duration: 750,
    });
  }
}
