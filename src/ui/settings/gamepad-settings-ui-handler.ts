import pad_dualshock from "#app/configs/inputs/pad_dualshock";
import pad_unlicensedSNES from "#app/configs/inputs/pad_unlicensedSNES";
import pad_xbox360 from "#app/configs/inputs/pad_xbox360";
import { MAPPING_CONFIG_LS_KEY } from "#app/constants/app-constants";
import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import type { InterfaceConfig } from "#app/inputs-controller";
import {
  setSettingGamepad,
  settingGamepadBlackList,
  settingGamepadDefaults,
  settingGamepadOptions,
} from "#app/system/settings/settings-gamepad";
import { ControlsSettingsUiHandler } from "#app/ui/settings/controls-settings-ui-handler";
import { addTextObject } from "#app/ui/text/text-utils";
import { truncateString } from "#app/utils/string-utils";
import { Device } from "#enums/devices";
import { SettingGamepad } from "#enums/setting-gamepad";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

/**
 * Class representing the settings UI handler for gamepads.
 *
 * @extends ControlsSettingsUiHandler
 */
export class GamepadSettingsUiHandler extends ControlsSettingsUiHandler {
  constructor() {
    super(UiMode.SETTINGS_GAMEPAD);
    this.titleSelected = "Gamepad";
    this.setting = SettingGamepad;
    this.settingDeviceDefaults = settingGamepadDefaults;
    this.settingDeviceOptions = settingGamepadOptions;
    this.configs = [pad_xbox360, pad_dualshock, pad_unlicensedSNES];
    this.commonSettingsCount = 2;
    this.localStoragePropertyName = MAPPING_CONFIG_LS_KEY;
    this.settingBlacklisted = settingGamepadBlackList;
    this.device = Device.GAMEPAD;
  }

  setSetting = setSettingGamepad;

  /**
   * Setup UI elements.
   */
  protected override setup() {
    super.setup();
    // If no gamepads are detected, set up a default UI prompt in the settings container.
    this.layout["noGamepads"] = new Map();
    const optionsContainer = globalScene.add.container(0, 0);
    optionsContainer.setVisible(false); // Initially hide the container as no gamepads are connected.
    const label = addTextObject(8, 28, i18next.t("settings:gamepadPleasePlug"), TextStyle.SETTINGS_LABEL);
    label.setOrigin(0, 0);
    optionsContainer.add(label);
    this.settingsContainer.add(optionsContainer);

    // Map the 'noGamepads' layout options for easy access.
    this.layout["noGamepads"].optionsContainer = optionsContainer;
    this.layout["noGamepads"].label = label;

    eventBus.on("gamepad/init", this.updateChosenGamepadDisplay, this);
  }

  protected override tearDown(): void {
    eventBus.off("gamepad/init", this.updateChosenGamepadDisplay, this);
    super.tearDown();
  }

  /**
   * Set the layout for the active configuration.
   *
   * @param activeConfig - The active gamepad configuration.
   * @returns `true` if the layout was successfully applied, otherwise `false`.
   */
  protected override setLayout(activeConfig: InterfaceConfig): boolean {
    // Check if there is no active configuration (e.g., no gamepad connected).
    if (!activeConfig) {
      // Retrieve the layout for when no gamepads are connected.
      const layout = this.layout["noGamepads"];
      // Make the options container visible to show message.
      layout.optionsContainer.setVisible(true);
      // Return false indicating the layout application was not successful due to lack of gamepad.
      return false;
    }

    return super.setLayout(activeConfig);
  }

  /**
   * Update the display of the chosen gamepad.
   */
  private updateChosenGamepadDisplay(): void {
    // Update any bindings that might have changed since the last update.
    this.updateBindings();
    this.resetScroll();

    // Iterate over the keys in the settingDevice enumeration.
    for (const [index, key] of Object.keys(this.setting).entries()) {
      const setting = this.setting[key]; // Get the actual setting value using the key.

      // Check if the current setting corresponds to the controller setting.
      if (setting === this.setting.Controller) {
        // Iterate over all layouts excluding the 'noGamepads' special case.
        for (const _key of Object.keys(this.layout)) {
          if (_key === "noGamepads") {
            continue;
          } // Skip updating the no gamepad layout.

          // Update the text of the first option label under the current setting to the name of the chosen gamepad,
          // truncating the name to 30 characters if necessary.
          this.layout[_key].optionValueLabels[index][0].setText(
            truncateString(globalScene.inputController.selectedDevice[Device.GAMEPAD], 20),
          );
        }
      }
    }
  }
}
