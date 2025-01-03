import { PlayerGender } from "#app/enums/player-gender";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { settings } from "#app/system/settings/settings-manager";
import { Mode } from "#app/ui/ui";
import i18next from "i18next";

export class SelectGenderPhase extends Phase {
  constructor() {
    super();
  }

  override start(): void {
    super.start();

    globalScene.ui.showText(i18next.t("menu:boyOrGirl"), null, () => {
      globalScene.ui.setMode(Mode.OPTION_SELECT, {
        options: [
          {
            label: i18next.t("settings:boy"),
            handler: () => {
              globalScene.gameData.gender = PlayerGender.MALE;
              settings.update("display", "playerGender", PlayerGender.MALE);
              globalScene.gameData.saveSystem().then(() => this.end());
              return true;
            },
          },
          {
            label: i18next.t("settings:girl"),
            handler: () => {
              globalScene.gameData.gender = PlayerGender.FEMALE;
              settings.update("display", "playerGender", PlayerGender.FEMALE);
              globalScene.gameData.saveSystem().then(() => this.end());
              return true;
            },
          },
        ],
      });
    });
  }

  override end(): void {
    globalScene.ui.setMode(Mode.MESSAGE);
    super.end();
  }
}
