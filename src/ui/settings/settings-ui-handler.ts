import { generalSettingsUiItems } from "#app/system/settings/settings-ui-items";
import { hasTouchscreen, isLandscapeMode } from "#app/utils";
import { t } from "i18next";
import AbstractSettingsUiHandler from "./abstract-settings-ui-handler";

export default class SettingsUiHandler extends AbstractSettingsUiHandler {
  /**
   * Creates an instance of SettingsGamepadUiHandler.
   *
   * @param scene - The BattleScene instance.
   * @param mode - The UI mode, optional.
   */
  constructor() {
    super("general", generalSettingsUiItems);

    window.addEventListener("resize", () => {
      this.updateMoveTouchControlsSettingsLabel();
    });
  }

  private updateMoveTouchControlsSettingsLabel() {
    if (!hasTouchscreen()) return;

    const settingIndex = this.uiItems.findIndex((uiItem) => uiItem.key === "moveTouchControls");
    if (settingIndex === -1) {
      console.warn("Could not find moveTouchControls setting label!");
    }

    this.updateOptionValueLabel(settingIndex, 0, isLandscapeMode() ? t("settings:landscape") : t("settings:portrait"));
  }
}
