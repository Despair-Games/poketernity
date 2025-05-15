import { SettingsUiHandler } from "#ui/settings-ui-handler";
import { audioSettingsUiItems } from "#ui/settings-ui-items";

export class AudioSettingsUiHandler extends SettingsUiHandler {
  constructor() {
    super("audio", audioSettingsUiItems);
  }
}
