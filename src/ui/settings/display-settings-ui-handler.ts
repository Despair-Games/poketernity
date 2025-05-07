import type { SupportedLanguage } from "#app/@types/Language";
import { LANGUAGE_MAX_OPTIONS } from "#app/constants/ui-constants";
import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { supportedLanguages } from "#app/system/settings/supported-languages";
import type { OptionSelectUiHandler } from "#app/ui/handlers/option-select-ui-handler";
import type { OptionSelectItem } from "#app/ui/interfaces/option-select-config";
import { SettingsUiHandler } from "#app/ui/settings/settings-ui-handler";
import { displaySettingUiItems } from "#app/ui/settings/settings-ui-items";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

export class DisplaySettingsUiHandler extends SettingsUiHandler {
  constructor() {
    super("display", displaySettingUiItems);
  }

  protected override setup(): void {
    super.setup();

    eventBus.on("language/change", this.showLanguageOptions, this);
  }

  protected override tearDown(): void {
    eventBus.off("language/change", this.showLanguageOptions, this);

    super.tearDown();
  }

  private showLanguageOptions() {
    const languageOptions: OptionSelectItem[] = [
      ...supportedLanguages
        .filter((l) => l.key !== i18next.resolvedLanguage)
        .map((l) => {
          return {
            label: l.label,
            handler: () => {
              if (this.canLoseProgress()) {
                this.showConfirm(
                  i18next.t("menuUiHandler:losingProgressionWarning"),
                  () => this.handleChangeLanguage(l),
                  () => this.handleCancelLanguageChange(),
                );
                return true;
              } else {
                return this.handleChangeLanguage(l);
              }
            },
          };
        }),
      {
        label: i18next.t("settings:back"),
        handler: () => {
          return this.handleCancelLanguageChange();
        },
      },
    ];

    globalScene.ui.setOverlayMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, {
      options: languageOptions,
      maxOptions: LANGUAGE_MAX_OPTIONS,
      yOffset: 48,
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
    return true;
  }
}
