import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { SettingKeys } from "#app/system/settings/settings";
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
              gameData.gender = PlayerGender.MALE;
              gameData.saveSetting(SettingKeys.Player_Gender, 0);
              gameData.saveSystem().then(() => this.end());
              return true;
            },
          },
          {
            label: i18next.t("settings:girl"),
            handler: () => {
              gameData.gender = PlayerGender.FEMALE;
              gameData.saveSetting(SettingKeys.Player_Gender, 1);
              gameData.saveSystem().then(() => this.end());
              return true;
            },
          },
        ],
      });
    });
  }

  public override end(): void {
    globalScene.ui.setMode(Mode.MESSAGE);
    super.end();
  }
}
