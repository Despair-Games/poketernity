import { globalScene } from "#app/global-scene";
import { ModifierRewardPhase } from "#phases/modifier-reward-phase";
import i18next from "i18next";

/**
 * Used to grant vouchers to the player after they finish a classic run
 */
export class GameOverModifierRewardPhase extends ModifierRewardPhase {
  public override readonly phaseName = "GameOverModifierRewardPhase";

  public override doReward(): Promise<void> {
    const { arenaBg, time, ui } = globalScene;

    return new Promise<void>((resolve) => {
      const newModifier = this.modifierType.newModifier();
      globalScene.addModifier(newModifier);
      // Sound loaded into game as is
      globalScene.audioManager.playSound("level_up_fanfare");
      ui.setMessageMode();
      ui.fadeIn(250).then(() => {
        ui.showText(i18next.t("battle:rewardGain", { modifierName: newModifier?.type.name }), {
          callback: () => {
            time.delayedCall(1500, () => arenaBg.setVisible(true));
            resolve();
          },
          prompt: true,
          promptDelay: 1500,
        });
      });
    });
  }
}
