import { globalScene } from "#app/global-scene";
import { PlayerGender } from "#app/enums/player-gender";
import { BattlePhase } from "./battle-phase";
import { settings } from "#app/system/settings/settings-manager";

export class ShowTrainerPhase extends BattlePhase {
  constructor() {
    super();
  }

  override start() {
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
