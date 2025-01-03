import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { addTextObject, TextStyle } from "#app/ui/text";
import { PlayerGender } from "#enums/player-gender";
import i18next from "i18next";

export class EndCardPhase extends Phase {
  public endCard: Phaser.GameObjects.Image;
  public text: Phaser.GameObjects.Text;

  public override start(): void {
    super.start();

    const { field, game, ui } = globalScene;

    ui.getMessageHandler().bg.setVisible(false);
    ui.getMessageHandler().nameBoxContainer.setVisible(false);

    this.endCard = globalScene.add.image(
      0,
      0,
      `end_${globalScene.gameData.gender === PlayerGender.FEMALE ? "f" : "m"}`,
    );
    this.endCard.setOrigin(0);
    this.endCard.setScale(0.5);
    field.add(this.endCard);

    this.text = addTextObject(
      game.canvas.width / 12,
      game.canvas.height / 6 - 16,
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
