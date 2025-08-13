import { UiMode } from "#enums/ui-mode";
import { NavigationManager } from "#ui/navigation-manager";
import i18next from "i18next";

/**
 * Manages navigation and menus tabs within the setting menu.
 */
export class SettingsNavigationManager extends NavigationManager {
  private static instance: SettingsNavigationManager;

  private constructor() {
    const options = [
      { mode: UiMode.SETTINGS, label: i18next.t("settings:general") },
      { mode: UiMode.SETTINGS_DISPLAY, label: i18next.t("settings:display") },
      { mode: UiMode.SETTINGS_AUDIO, label: i18next.t("settings:audio") },
      { mode: UiMode.SETTINGS_GAMEPAD, label: i18next.t("settings:gamepad") },
      { mode: UiMode.SETTINGS_KEYBOARD, label: i18next.t("settings:keyboard") },
    ];
    super(options);
  }

  /**
   * @returns The singleton instance of NavigationManager.
   */
  public static getInstance(): NavigationManager {
    if (!SettingsNavigationManager.instance) {
      SettingsNavigationManager.instance = new SettingsNavigationManager();
    }
    return SettingsNavigationManager.instance;
  }
}
