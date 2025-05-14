import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import { FieldPhase } from "#phases/abstract-field-phase";
import i18next from "i18next";

/**
 * Displays the message for when the level cap increases
 * @extends FieldPhase
 */
export class LevelCapPhase extends FieldPhase {
  override readonly id = PhaseId.LEVEL_CAP;

  public override start(): void {
    super.start();

    globalScene.ui.setMessageMode().then(() => {
      // Sound loaded into game as is
      globalScene.audioManager.playSound("level_up_fanfare");
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
