import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import { PlayerGender } from "#enums/player-gender";
import { TextStyle } from "#enums/text-style";
import { settings } from "#system/settings-manager";
import { addTextObject } from "#ui/text-utils";
import i18next from "i18next";

/** Displays the End Card after a classic run ends in victory. */
export class EndCardPhase extends Phase {
  public override readonly phaseName = "EndCardPhase";

  public endCard: Phaser.GameObjects.Image;
  public text: Phaser.GameObjects.Text;

  public override async start(): Promise<void> {
    const { add, field, ui } = globalScene;
    const messageHandler = ui.getMessageHandler();

    messageHandler?.bg.setVisible(false);
    messageHandler?.nameBoxContainer.setVisible(false);

    this.endCard = add
      .image(0, 0, `end_${settings.display.playerGender === PlayerGender.FEMALE ? "f" : "m"}`)
      .setOrigin(0);
    field.add(this.endCard);

    this.text = addTextObject(GAME_WIDTH / 2, GAME_HEIGHT - 16, i18next.t("battle:congratulations"), TextStyle.END_CARD) //
      .setOrigin(0.5);
    field.add(this.text);

    ui.clearText();

    await ui.fadeIn(1000);
    ui.showText("", {
      callback: () => {
        messageHandler?.bg.setVisible(true);
        this.end();
      },
      // TODO: should this not have a prompt (and set delay to 0)?
      prompt: true,
    });
  }
}
