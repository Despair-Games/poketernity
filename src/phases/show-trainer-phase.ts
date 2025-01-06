import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { PlayerGender } from "#enums/player-gender";
import { BattlePhase } from "./abstract-battle-phase";

export class ShowTrainerPhase extends BattlePhase {
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
