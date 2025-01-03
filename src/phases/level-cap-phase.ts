import { globalScene } from "#app/global-scene";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";
import { FieldPhase } from "./abstract-field-phase";

/**
 * Displays the message for when the level cap increases
 * @extends FieldPhase
 */
export class LevelCapPhase extends FieldPhase {
  public override start(): void {
    super.start();

    globalScene.ui.setMode(Mode.MESSAGE).then(() => {
      // Sound loaded into game as is
      globalScene.playSound("level_up_fanfare");
      globalScene.ui.showText(
        i18next.t("battle:levelCapUp", { levelCap: globalScene.getMaxExpLevel() }),
        null,
        () => this.end(),
        null,
        true,
      );
      this.executeForAll((pokemon) => pokemon.updateInfo(true));
    });
  }
}
