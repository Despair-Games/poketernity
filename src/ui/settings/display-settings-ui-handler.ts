import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { LANGUAGE_MAX_OPTIONS } from "#constants/ui-constants";
import { UiMode } from "#enums/ui-mode";
import { supportedLanguages } from "#system/supported-languages";
import type { SupportedLanguage } from "#types/language";
import type { OptionSelectItem } from "#ui/option-select-config";
import type { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import { SettingsUiHandler } from "#ui/settings-ui-handler";
import { displaySettingUiItems } from "#ui/settings-ui-items";
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
              }
              return this.handleChangeLanguage(l);
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
