import { globalScene } from "#app/global-scene";
import type { ModifierTypeFunc } from "#app/modifier/modifier-type";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";
import { ModifierRewardPhase } from "./modifier-reward-phase";

/**
 * Used to grant vouchers to the player after they finish a classic run
 * @extends ModifierRewardPhase
 */
export class GameOverModifierRewardPhase extends ModifierRewardPhase {
  constructor(modifierTypeFunc: ModifierTypeFunc) {
    super(modifierTypeFunc);
  }

  public override doReward(): Promise<void> {
    const { arenaBg, time, ui } = globalScene;

    return new Promise<void>((resolve) => {
      const newModifier = this.modifierType.newModifier();
      globalScene.addModifier(newModifier);
      // Sound loaded into game as is
      globalScene.playSound("level_up_fanfare");
      ui.setMode(Mode.MESSAGE);
      ui.fadeIn(250).then(() => {
        ui.showText(
          i18next.t("battle:rewardGain", { modifierName: newModifier?.type.name }),
          null,
          () => {
            time.delayedCall(1500, () => arenaBg.setVisible(true));
            resolve();
          },
          null,
          true,
          1500,
        );
      });
    });
  }
}
