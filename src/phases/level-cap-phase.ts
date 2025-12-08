import { globalScene } from "#app/global-scene";
import { BattlePhase } from "#phases/base/battle-phase";
import i18next from "i18next";

/**
 * Displays the message for when the level cap increases
 */
export class LevelCapPhase extends BattlePhase {
  public override readonly phaseName = "LevelCapPhase";

  public override start(): void {
    globalScene.ui.setMessageMode().then(() => {
      // Sound loaded into game as is
      globalScene.audioManager.playSound("level_up_fanfare");
      globalScene.ui.showText(i18next.t("battle:levelCapUp", { levelCap: globalScene.getMaxExpLevel() }), {
        callback: () => this.end(),
        prompt: true,
      });

      globalScene.getField(true).forEach((p) => p.updateInfo(true));
    });
  }
}
