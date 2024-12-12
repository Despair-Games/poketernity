import { SETTINGS_LS_KEY } from "#app/constants";
import { globalScene } from "#app/global-scene";
import { settings, SettingsManager } from "#app/system/settings/settings-manager";
import { displaySettingUiItems } from "#app/system/settings/settings-ui-items";
import { supportedLanguages } from "#app/system/settings/supported-languages";
import i18next from "i18next";
import { Mode } from "../ui";
import AbstractSettingsUiHandler from "./abstract-settings-ui-handler";
("#app/inputs-controller");

export default class SettingsDisplayUiHandler extends AbstractSettingsUiHandler {
  /**
   * Creates an instance of SettingsGamepadUiHandler.
   *
   * @param scene - The BattleScene instance.
   * @param mode - The UI mode, optional.
   */
  constructor() {
    super("display", displaySettingUiItems);
    this.localStorageKey = SETTINGS_LS_KEY;

    settings.eventBus.on(SettingsManager.Event.ChangeLanguage, () => {
      const onCancel = () => {
        console.log("cancelHandler!");
        this.setOptionCursor(0, 0);
        globalScene.ui.revertMode();
        return false;
      };

      globalScene.ui.setOverlayMode(Mode.OPTION_SELECT, {
        options: [
          ...supportedLanguages.map((l) => {
            return {
              label: l.label,
              handler: () => {
                i18next.changeLanguage(l.key);
                this.setOptionCursor(0, 0);
                this.updateOptionValueLabel(0, 0, l.label);
                globalScene.ui.revertMode();
                window.location.reload();
              },
            };
          }),
          {
            label: i18next.t("settings:back"),
            handler: () => onCancel(),
          },
        ],
        maxOptions: 7,
        cancelHandler: onCancel.bind(this),
      });
    });
  }
}
