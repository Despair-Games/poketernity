import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { addTextObject } from "#app/ui/text";
import { TextStyle } from "#enums/text-style";
import { PlayerGender } from "#enums/player-gender";
import i18next from "i18next";
import { settings } from "#app/system/settings/settings-manager";
import { GAME_WIDTH, GAME_HEIGHT } from "#app/ui-constants";

/**
 * Displays the End Card after a classic run ends in victory.
 *
 * @extends Phase
 */
export class EndCardPhase extends Phase {
  public endCard: Phaser.GameObjects.Image;
  public text: Phaser.GameObjects.Text;

  public override start(): void {
    super.start();

    const { field, ui } = globalScene;

    ui.getMessageHandler().bg.setVisible(false);
    ui.getMessageHandler().nameBoxContainer.setVisible(false);

    this.endCard = globalScene.add.image(
      0,
      0,
      `end_${settings.display.playerGender === PlayerGender.FEMALE ? "f" : "m"}`,
    );
    this.endCard.setOrigin(0);
    field.add(this.endCard);

    this.text = addTextObject(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 16,
      i18next.t("battle:congratulations"),
      TextStyle.SUMMARY,
      { fontSize: "128px" },
    );
    this.text.setOrigin(0.5);
    field.add(this.text);

    ui.clearText();

    ui.fadeIn(1000).then(() => {
      ui.showText(
        "",
        null,
        () => {
          ui.getMessageHandler().bg.setVisible(true);
          this.end();
        },
        null,
        true,
      );
    });
  }
}
