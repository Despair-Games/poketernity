import { audioSettingsUiItems } from "#app/ui/settings/settings-ui-items";
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
    this.rowsToDisplay = 6;
  }
}
