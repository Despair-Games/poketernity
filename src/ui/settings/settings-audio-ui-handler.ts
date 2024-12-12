import type { Mode } from "../ui";
import AbstractSettingsUiHandler from "./abstract-settings-ui-handler";
import { SettingType } from "#app/system/settings/settings";
import { audioSettingsUiItems } from "#app/system/settings/settings-ui-items";
import { SETTINGS_LS_KEY } from "#app/constants";
("#app/inputs-controller");

export default class SettingsAudioUiHandler extends AbstractSettingsUiHandler {
  /**
   * Creates an instance of SettingsAudioUiHandler.
   *
   * @param scene - The BattleScene instance.
   * @param mode - The UI mode, optional.
   */
  constructor(mode: Mode | null = null) {
    super(SettingType.AUDIO, mode, audioSettingsUiItems);
    this.title = "Audio";
    this.localStorageKey = SETTINGS_LS_KEY;
    this.rowsToDisplay = 6;
  }
}
