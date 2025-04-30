import { audioSettingsUiItems } from "#app/ui/settings/settings-ui-items";
import { AbstractSettingsUiHandler } from "./abstract-settings-ui-handler";

export class AudioSettingsUiHandler extends AbstractSettingsUiHandler {
  constructor() {
    super("audio", audioSettingsUiItems);
  }
}
