import { UiMode } from "#enums/ui-mode";
import { NavigationManager } from "#ui/navigation-manager";
import i18next from "i18next";

/**
 * Manages navigation and menus tabs within the setting menu.
 */
export class SettingsNavigationManager extends NavigationManager {
  private static instance: SettingsNavigationManager;

  private constructor() {
    const modes = [
      UiMode.SETTINGS,
      UiMode.SETTINGS_DISPLAY,
      UiMode.SETTINGS_AUDIO,
      UiMode.SETTINGS_GAMEPAD,
      UiMode.SETTINGS_KEYBOARD,
    ];
    const labels = [
      i18next.t("settings:general"),
      i18next.t("settings:display"),
      i18next.t("settings:audio"),
      i18next.t("settings:gamepad"),
      i18next.t("settings:keyboard"),
    ];
    super(modes, labels);
  }

  /**
   * Gets the singleton instance of the NavigationManager.
   * @returns The singleton instance of NavigationManager.
   */
  public static getInstance(): NavigationManager {
    if (!SettingsNavigationManager.instance) {
      SettingsNavigationManager.instance = new SettingsNavigationManager();
    }
    return SettingsNavigationManager.instance;
  }
}
