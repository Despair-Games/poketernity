import { audioSettingsUiItems } from "#app/ui/settings/settings-ui-items";
import { AbstractSettingsUiHandler } from "./abstract-settings-ui-handler";

export class SettingsAudioUiHandler extends AbstractSettingsUiHandler {
  /**
   * Creates an instance of SettingsAudioUiHandler.
   *
   * @param mode - The UI mode, optional.
   */
  constructor() {
    super("audio", audioSettingsUiItems);
  }
}
