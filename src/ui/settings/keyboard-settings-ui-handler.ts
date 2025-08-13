import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { Device } from "#enums/device";
import { KeyboardLayout } from "#enums/keyboard-layout";
import { SettingKeyboard } from "#enums/setting-keyboard";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import type { SettingsUiItem } from "#types/settings";
import { ControlsSettingsUiHandler } from "#ui/controls-settings-ui-handler";
import type { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import { keyboardSettingsUiItems } from "#ui/settings-ui-items";
import { setTextColor } from "#ui/text-utils";
import { enumValueToKey } from "#utils/common-utils";
import { deleteBind } from "#utils/inputs-utils";
import { truncateString } from "#utils/string-utils";
import i18next from "i18next";

/**
 * Class representing the settings UI handler for keyboards.
 */
export class KeyboardSettingsUiHandler extends ControlsSettingsUiHandler {
  private deleteKey: Phaser.Input.Keyboard.Key | undefined;

  constructor() {
    super(UiMode.SETTINGS_KEYBOARD, "keyboard", keyboardSettingsUiItems, Device.KEYBOARD, UiMode.KEYBOARD_BINDING);
  }

  protected override setup() {
    super.setup();

    // Add instructions for deleting a mapping
    this.addInstructionText("BUTTON_DELETE", i18next.t("settings:delete"));

    eventBus.on("keyboard/init", this.updateChosenKeyboardDisplay, this);
  }

  protected override tearDown(): void {
    eventBus.off("keyboard/init", this.updateChosenKeyboardDisplay, this);

    super.tearDown();
  }

  public override show(): boolean {
    if (super.show()) {
      // If a keyboard is connected but the view hasn't been initialized for it, do it
      if (this.noDeviceText.visible && globalScene.inputController.getActiveConfig(this.device)) {
        this.updateChosenKeyboardDisplay();
      }
      // Listen to the "delete" key presses to clear an existing mapping
      this.deleteKey = globalScene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE);
      this.deleteKey?.on("up", this.deleteBinding, this);
      return true;
    }
    return false;
  }

  protected override clear(): void {
    this.deleteKey?.off("up", this.deleteBinding, this);

    super.clear();
  }

  /**
   * Update the display of the chosen keyboard layout.
   */
  private updateChosenKeyboardDisplay(): void {
    this.noDeviceText.setVisible(false);
    this.optionsContainer.setVisible(true);

    // Update any bindings that might have changed since the last update.
    this.initBindings();
    this.updateInstructionIcons();

    // Iterate over the keys in the settingDevice enumeration.
    for (const [index, value] of Object.values(SettingKeyboard).entries()) {
      if (value === "layout") {
        // Update the text of the first option label under the current setting to the name of the chosen layout
        const layoutLabel = truncateString(enumValueToKey(KeyboardLayout, settings.keyboard.layout), 25);
        this.updateOptionValueLabel(index, 0, layoutLabel);
      }
    }
  }

  protected override handleSaveSetting<V = any>(uiItem: SettingsUiItem, newValue: V): void {
    if (uiItem.key === "layout") {
      // Show menu with the available keyboard layouts
      const cancelHandler = () => {
        globalScene.ui.revertMode();
        this.setOptionCursor(-1, 0);
        return true;
      };
      const changeLayoutHandler = (layout: KeyboardLayout) => {
        if (settings.keyboard.layout !== layout) {
          settings.update("keyboard", "layout", layout);
        }
        return cancelHandler();
      };
      globalScene.ui.setOverlayMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, {
        options: [
          ...Object.keys(KeyboardLayout).map((layout) => {
            return {
              label: layout,
              handler: () => changeLayoutHandler(KeyboardLayout[layout]),
            };
          }),
          {
            label: i18next.t("menu:cancel"),
            handler: cancelHandler,
          },
        ],
        yOffset: 48,
      });
    } else {
      super.handleSaveSetting(uiItem, newValue);
    }
  }

  /**
   * Handle the delete key press event: remove mapping for the current button
   */
  private deleteBinding(): void {
    if (globalScene.ui.getMode() !== UiMode.SETTINGS_KEYBOARD) {
      return;
    }

    if (this.cursor + this.scrollCursor < this.uiItems.length) {
      // We are currently not hovering a binding setting, ignore the input
      return;
    }

    let success = false;
    const config = globalScene.inputController.getActiveConfig(this.device);
    if (config) {
      const settingIndex = this.cursor + this.scrollCursor - this.uiItems.length;
      const settingKey = Object.keys(config.settings)[settingIndex] as SettingKeyboard;

      success = deleteBind(config, settingKey);
      const deviceId = globalScene.inputController.selectedDevice[this.device];
      if (success && deviceId) {
        globalScene.gameData.saveMappingConfigs(deviceId, config);
        this.updateBindingIcons();
      }
    }

    if (success) {
      this.getUi().playSelect();
    } else {
      this.getUi().playError();
    }
  }

  public override setCursor(cursor: number): boolean {
    if (super.setCursor(cursor)) {
      this.updateDeleteInstruction();
      return true;
    }
    return false;
  }

  protected override setScrollCursor(scrollCursor: number): boolean {
    if (super.setScrollCursor(scrollCursor)) {
      this.updateDeleteInstruction();
      return true;
    }
    return false;
  }

  /**
   * Make the "delete" instruction text grayed out if the current setting cannot be deleted.
   */
  private updateDeleteInstruction(): void {
    let isLocked = false;
    const settingIndex = this.cursor + this.scrollCursor;
    if (settingIndex < this.uiItems.length) {
      isLocked = true;
    } else {
      const config = globalScene.inputController.getActiveConfig(this.device);
      if (config) {
        const settingKey = Object.keys(config.settings)[settingIndex - this.uiItems.length] as SettingKeyboard;
        if (config.settingsBlacklist?.includes(settingKey)) {
          isLocked = true;
        }
      }
    }

    const textStyle = isLocked ? TextStyle.SETTINGS_LOCKED : TextStyle.SETTINGS_LABEL;
    if (this.instructionIcons["BUTTON_DELETE"]?.label) {
      setTextColor(this.instructionIcons["BUTTON_DELETE"].label, textStyle);
    }
  }
}
