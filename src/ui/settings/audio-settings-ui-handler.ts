import { audioSettingsUiItems } from "#app/ui/settings/settings-ui-items";
import { SettingsUiHandler } from "./settings-ui-handler";

export class AudioSettingsUiHandler extends SettingsUiHandler {
  constructor() {
    super("audio", audioSettingsUiItems);
  }
}
