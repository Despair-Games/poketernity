import cfg_keyboard_qwerty from "#app/configs/inputs/cfg_keyboard_qwerty";
import { deleteBind } from "#app/configs/inputs/configHandler";
import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import type { InterfaceConfig } from "#app/inputs-controller";
import {
  setSettingKeyboard,
  settingKeyboardBlackList,
  settingKeyboardDefaults,
  settingKeyboardOptions,
} from "#app/system/settings/settings-keyboard";
import { ControlsSettingsUiHandler } from "#app/ui/settings/controls-settings-ui-handler";
import { NavigationManager } from "#app/ui/settings/navigation-menu";
import { addTextObject } from "#app/ui/text/text-utils";
import { truncateString } from "#app/utils/string-utils";
import { Device } from "#enums/devices";
import { SettingKeyboard } from "#enums/setting-keyboard";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

/**
 * Class representing the settings UI handler for keyboards.
 *
 * @extends ControlsSettingsUiHandler
 */
export class KeyboardSettingsUiHandler extends ControlsSettingsUiHandler {
  private deleteKey: Phaser.Input.Keyboard.Key | undefined;
  private homeKey: Phaser.Input.Keyboard.Key | undefined;

  constructor() {
    super(UiMode.SETTINGS_KEYBOARD);
    this.titleSelected = "Keyboard";
    this.setting = SettingKeyboard;
    this.settingDeviceDefaults = settingKeyboardDefaults;
    this.settingDeviceOptions = settingKeyboardOptions;
    this.configs = [cfg_keyboard_qwerty];
    this.commonSettingsCount = 0;
    this.textureOverride = "keyboard";
    this.settingBlacklisted = settingKeyboardBlackList;
    this.device = Device.KEYBOARD;
  }

  setSetting = setSettingKeyboard;

  /**
   * Setup UI elements.
   */
  protected override setup() {
    super.setup();
    // If no gamepads are detected, set up a default UI prompt in the settings container.
    this.layout["noKeyboard"] = new Map();
    const optionsContainer = globalScene.add.container(0, 0);
    optionsContainer.setVisible(false); // Initially hide the container as no gamepads are connected.
    const label = addTextObject(8, 28, i18next.t("settings:keyboardPleasePress"), TextStyle.SETTINGS_LABEL);
    label.setOrigin(0, 0);
    optionsContainer.add(label);
    this.settingsContainer.add(optionsContainer);

    const iconDelete = globalScene.add.sprite(0, 0, "keyboard");
    iconDelete.setOrigin(0, -0.1);
    iconDelete.setPositionRelative(this.actionsBg, this.navigationContainer.width - 260, 4);
    this.navigationIcons["BUTTON_DELETE"] = iconDelete;

    const deleteText = addTextObject(0, 0, i18next.t("settings:delete"), TextStyle.SETTINGS_LABEL);
    deleteText.setOrigin(0, 0.15);
    deleteText.setPositionRelative(iconDelete, -deleteText.displayWidth - 2, 0);

    this.settingsContainer.add(iconDelete);
    this.settingsContainer.add(deleteText);

    // Map the 'noKeyboard' layout options for easy access.
    this.layout["noKeyboard"].optionsContainer = optionsContainer;
    this.layout["noKeyboard"].label = label;

    // Listen to the home and delete key presses
    this.deleteKey = globalScene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE);
    this.homeKey = globalScene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.HOME);
    this.deleteKey?.on("up", this.deleteBinding, this);
    this.homeKey?.on("up", this.resetBindings, this);

    eventBus.on("keyboard/init", this.updateChosenKeyboardDisplay, this);
  }

  protected override tearDown(): void {
    this.deleteKey?.off("up", this.deleteBinding, this);
    this.homeKey?.off("up", this.resetBindings, this);

    eventBus.off("keyboard/init", this.updateChosenKeyboardDisplay, this);

    super.tearDown();
  }

  /**
   * Handle the home key press event: reset mappings for the current device
   */
  private resetBindings(): void {
    if (![UiMode.SETTINGS_KEYBOARD, UiMode.SETTINGS_GAMEPAD].includes(globalScene.ui.getMode())) {
      return;
    }
    const isKeyboard = globalScene.ui.getMode() === UiMode.SETTINGS_KEYBOARD;
    globalScene.gameData.resetMappingToFactory(isKeyboard ? Device.KEYBOARD : Device.GAMEPAD);
    NavigationManager.getInstance().updateIcons();
  }

  /**
   * Handle the delete key press event: remove mapping for the current button
   */
  private deleteBinding(): void {
    if (globalScene.ui.getMode() !== UiMode.SETTINGS_KEYBOARD) {
      return;
    }
    const cursor = this.cursor + this.scrollCursor; // Calculate the absolute cursor position.
    const target = this.setting[Object.keys(this.setting)[cursor]];
    const activeConfig = this.getActiveConfig();
    const success = deleteBind(this.getActiveConfig(), target);
    if (success) {
      globalScene.gameData.saveMappingConfigs(
        globalScene.inputController?.selectedDevice[Device.KEYBOARD],
        activeConfig,
      );
      this.updateBindings();
      NavigationManager.getInstance().updateIcons();
    }
  }

  /**
   * Set the layout for the active configuration.
   *
   * @param activeConfig - The active keyboard configuration.
   * @returns `true` if the layout was successfully applied, otherwise `false`.
   */
  protected override setLayout(activeConfig: InterfaceConfig): boolean {
    // Check if there is no active configuration (e.g., no gamepad connected).
    if (!activeConfig) {
      // Retrieve the layout for when no gamepads are connected.
      const layout = this.layout["noKeyboard"];
      // Make the options container visible to show message.
      layout.optionsContainer.setVisible(true);
      // Return false indicating the layout application was not successful due to lack of gamepad.
      return false;
    }

    return super.setLayout(activeConfig);
  }

  /**
   * Update the display of the chosen keyboard layout.
   */
  private updateChosenKeyboardDisplay(): void {
    // Update any bindings that might have changed since the last update.
    this.updateBindings();

    // Iterate over the keys in the settingDevice enumeration.
    for (const [index, key] of Object.keys(this.setting).entries()) {
      const setting = this.setting[key]; // Get the actual setting value using the key.

      // Check if the current setting corresponds to the layout setting.
      if (setting === this.setting.Default_Layout) {
        // Iterate over all layouts excluding the 'noGamepads' special case.
        for (const _key of Object.keys(this.layout)) {
          if (_key === "noKeyboard") {
            continue;
          } // Skip updating the no gamepad layout.
          // Update the text of the first option label under the current setting to the name of the chosen gamepad,
          // truncating the name to 30 characters if necessary.
          this.layout[_key].optionValueLabels[index][0].setText(
            truncateString(globalScene.inputController.selectedDevice[Device.KEYBOARD], 22),
          );
        }
      }
    }
  }
}
