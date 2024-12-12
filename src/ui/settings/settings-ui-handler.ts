import { SETTINGS_LS_KEY } from "#app/constants";
import { generalSettingsUiItems } from "#app/system/settings/settings-ui-items";
import { SettingType } from "../../system/settings/settings";
import type { Mode } from "../ui";
import AbstractSettingsUiHandler from "./abstract-settings-ui-handler";

export default class SettingsUiHandler extends AbstractSettingsUiHandler {
  /**
   * Creates an instance of SettingsGamepadUiHandler.
   *
   * @param scene - The BattleScene instance.
   * @param mode - The UI mode, optional.
   */
  constructor(mode: Mode | null = null) {
    super(SettingType.GENERAL, mode, generalSettingsUiItems);
    this.title = "General";
    this.localStorageKey = SETTINGS_LS_KEY;
  }
}
