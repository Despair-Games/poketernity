import { SETTINGS_LS_KEY } from "#app/constants";
import { generalSettingsUiItems } from "#app/system/settings/settings-ui-items";
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
    this.localStorageKey = SETTINGS_LS_KEY;
  }
}
