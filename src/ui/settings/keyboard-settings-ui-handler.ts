import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { Device } from "#enums/device";
import { KeyboardLayout } from "#enums/keyboard-layout";
import { SettingKeyboard } from "#enums/setting-keyboard";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import type { KeyboardKeys } from "#types/input-interface-config";
import { SettingsUiItem } from "#types/settings";
import { ControlsSettingsUiHandler } from "#ui/controls-settings-ui-handler";
import type { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import { enumValueToKey, getTSEnumKeys } from "#utils/common-utils";
import { truncateString } from "#utils/string-utils";
import i18next from "i18next";
import { keyboardSettingsUiItems } from "./settings-ui-items";

/**
 * Class representing the settings UI handler for keyboards.
 *
 * TODO:
 * - re implement deleting mapping
 * - prevent deleting some mappings even if not locked? (see 284)
 * - implement binding swapping like for gamepad?
 * - implement keyboard layout switching
 */
export class KeyboardSettingsUiHandler extends ControlsSettingsUiHandler<KeyboardKeys, SettingKeyboard> {
  private deleteKey: Phaser.Input.Keyboard.Key | undefined;

  constructor() {
    super(UiMode.SETTINGS_KEYBOARD, "keyboard", keyboardSettingsUiItems, Device.KEYBOARD, UiMode.KEYBOARD_BINDING);

    this.buttonsTextureMap = "keyboard";
  }

  /**
   * Setup UI elements.
   */
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
      // Listen to the delete key presses to delete an existing mapping
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
   * Handle the delete key press event: remove mapping for the current button
   */
  private deleteBinding(): void {
    console.log("DELETE BINDING");
    if (globalScene.ui.getMode() !== UiMode.SETTINGS_KEYBOARD) {
      return;
    }
    /*const cursor = this.cursor + this.scrollCursor; // Calculate the absolute cursor position.
    const target = this.setting[Object.keys(this.setting)[cursor]];
    const activeConfig = this.getActiveConfig();
    const success = deleteBind(this.getActiveConfig(), target);
    if (success) {
      globalScene.gameData.saveMappingConfigs(
        globalScene.inputController?.selectedDevice[Device.KEYBOARD],
        activeConfig,
      );
      this.updateBindings();
      SettingsNavigationManager.getInstance().updateIcons();
    }*/
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
      console.log(index, value);
      if (value === "layout") {
        // Update the text of the first option label under the current setting to the name of the chosen layout
        this.updateOptionValueLabel(
          index,
          0,
          truncateString(enumValueToKey(KeyboardLayout, settings.keyboard.layout ?? KeyboardLayout.QWERTY), 25),
        );
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
          globalScene.inputController.setChosenKeyboardLayout(layout);
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
}
