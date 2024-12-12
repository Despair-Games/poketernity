import { SETTINGS_LS_KEY } from "#app/constants";
import { audioSettingsUiItems } from "#app/system/settings/settings-ui-items";
import AbstractSettingsUiHandler from "./abstract-settings-ui-handler";
("#app/inputs-controller");

export default class SettingsAudioUiHandler extends AbstractSettingsUiHandler {
  /**
   * Creates an instance of SettingsAudioUiHandler.
   *
   * @param scene - The BattleScene instance.
   * @param mode - The UI mode, optional.
   */
  constructor() {
    super("audio", audioSettingsUiItems);
    this.localStorageKey = SETTINGS_LS_KEY;
    this.rowsToDisplay = 6;
  }
}
