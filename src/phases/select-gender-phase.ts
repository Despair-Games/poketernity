import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { settings } from "#app/system/settings/settings-manager";
import type { OptionSelectUiHandler } from "#app/ui/handlers/option-select-ui-handler";
import type { OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { PhaseId } from "#enums/phase-id";
import { PlayerGender } from "#enums/player-gender";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

export class SelectGenderPhase extends Phase {
  override readonly id = PhaseId.SELECT_GENDER;

  public override start(): void {
    super.start();

    const { gameData, ui } = globalScene;

    const menuOptionsConfig: OptionSelectModeConfig = {
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
      inputDelay: 1000,
      blockCancelButton: true,
      yOffset: 48,
    };

    ui.showText(i18next.t("menu:boyOrGirl"), null, () => {
      ui.setMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, menuOptionsConfig);
    });
  }

  public override end(): void {
    globalScene.ui.setMessageMode();
    super.end();
  }
}
