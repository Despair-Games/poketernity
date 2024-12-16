import type { SupportedLanguage } from "#app/@types/Language";
import { LANGUAGE_MAX_OPTIONS } from "#app/constants";
import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { displaySettingUiItems } from "#app/ui/settings/settings-ui-items";
import { supportedLanguages } from "#app/system/settings/supported-languages";
import i18next from "i18next";
import { Mode } from "../ui";
import AbstractSettingsUiHandler from "./abstract-settings-ui-handler";
("#app/inputs-controller");

export default class SettingsDisplayUiHandler extends AbstractSettingsUiHandler {
  /**
   * Creates an instance of SettingsGamepadUiHandler.
   *
   * @param mode - The UI mode, optional.
   */
  constructor() {
    super("display", displaySettingUiItems);

    eventBus.on("language/change", () => {
      globalScene.ui.setOverlayMode(Mode.OPTION_SELECT, {
        options: [
          ...supportedLanguages
            .filter((l) => l.key !== i18next.resolvedLanguage)
            .map((l) => {
              return {
                label: l.label,
                handler: () => {
                  if (this.canLoseProgress()) {
                    this.showConfirmReload(
                      () => this.handleChangeLanguage(l),
                      () => this.handleCancelLanguageChange(),
                    );
                  } else {
                    this.handleChangeLanguage(l);
                  }
                },
              };
            }),
          {
            label: i18next.t("settings:back"),
            handler: () => this.handleCancelLanguageChange(),
          },
        ],
        maxOptions: LANGUAGE_MAX_OPTIONS,
      });
    });
  }

  private handleCancelLanguageChange() {
    this.setOptionCursor(0, 0);
    globalScene.ui.revertMode();
    return true;
  }

  private handleChangeLanguage(lan: SupportedLanguage) {
    i18next.changeLanguage(lan.key);
    this.setOptionCursor(0, 0);
    this.updateOptionValueLabel(0, 0, lan.label);
    window.location.reload();
  }
}
