import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { settings } from "#app/system/settings/settings-manager";
import { Mode } from "#app/ui/ui";
import { PlayerGender } from "#enums/player-gender";
import i18next from "i18next";

export class SelectGenderPhase extends Phase {
  public override start(): void {
    super.start();

    const { gameData, ui } = globalScene;

    ui.showText(i18next.t("menu:boyOrGirl"), null, () => {
      ui.setMode(Mode.OPTION_SELECT, {
        options: [
          {
            label: i18next.t("settings:boy"),
            handler: () => {
              settings.update("display", "playerGender", PlayerGender.MALE);
              gameData.saveSystem().then(() => this.end());
              return true;
            },
          },
          {
            label: i18next.t("settings:girl"),
            handler: () => {
              settings.update("display", "playerGender", PlayerGender.FEMALE);
              gameData.saveSystem().then(() => this.end());
              return true;
            },
          },
        ],
        noCancel: true,
        yOffset: 48,
      });
    });
  }

  public override end(): void {
    globalScene.ui.setMode(Mode.MESSAGE);
    super.end();
  }
}
