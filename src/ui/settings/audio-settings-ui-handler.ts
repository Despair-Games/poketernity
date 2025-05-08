import { SettingsUiHandler } from "#app/ui/settings/settings-ui-handler";
import { audioSettingsUiItems } from "#app/ui/settings/settings-ui-items";

export class AudioSettingsUiHandler extends SettingsUiHandler {
  constructor() {
    super("audio", audioSettingsUiItems);
  }
}
