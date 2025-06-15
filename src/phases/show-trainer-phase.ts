import { globalScene } from "#app/global-scene";
import { PlayerGender } from "#enums/player-gender";
import { BattlePhase } from "#phases/base/battle-phase";
import { settings } from "#system/settings-manager";

export class ShowTrainerPhase extends BattlePhase {
  public override readonly phaseName = "ShowTrainerPhase";

  public override start(): void {
    super.start();

    globalScene.trainer.setVisible(true);

    globalScene.trainer.setTexture(`trainer_${settings.display.playerGender === PlayerGender.FEMALE ? "f" : "m"}_back`);

    globalScene.tweens.add({
      targets: globalScene.trainer,
      x: 106,
      duration: 1000,
      onComplete: () => this.end(),
    });
  }
}
