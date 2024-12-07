import { TrainerSlot } from "#app/data/trainer-config";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

export class BattlePhase extends Phase {
  constructor() {
    super();
  }

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
      [sprites[i], tintSprites[i]].map((sprite) => {
        if (visible) {
          sprite.x = trainerSlot || sprites.length < 2 ? 0 : i ? 16 : -16;
        }
        sprite.setVisible(visible);
        sprite.clearTint();
      });
      sprites[i].setVisible(visible);
      tintSprites[i].setVisible(visible);
      sprites[i].clearTint();
      tintSprites[i].clearTint();
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
