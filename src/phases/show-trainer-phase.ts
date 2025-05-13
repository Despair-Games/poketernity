import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import { PlayerGender } from "#enums/player-gender";
import { BattlePhase } from "#phases/abstract-battle-phase";
import { settings } from "#system/settings-manager";

export class ShowTrainerPhase extends BattlePhase {
  override readonly id = PhaseId.SHOW_TRAINER;

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
