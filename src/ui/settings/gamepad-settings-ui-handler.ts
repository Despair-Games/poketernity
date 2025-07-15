import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { Button } from "#enums/button";
import { Device } from "#enums/device";
import { SettingGamepad } from "#enums/setting-gamepad";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import { GamepadKeys } from "#types/input-interface-config";
import { SettingsUiItem } from "#types/settings";
import { ControlsSettingsUiHandler } from "#ui/controls-settings-ui-handler";
import { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import { gamepadSettingsUiItems } from "#ui/settings-ui-items";
import { addTextObject } from "#ui/text-utils";
import { truncateString } from "#utils/string-utils";
import i18next from "i18next";

/**
 * Class representing the settings UI handler for gamepads.
 */
export class GamepadSettingsUiHandler extends ControlsSettingsUiHandler<GamepadKeys, SettingGamepad> {
  private noGamepadText: Phaser.GameObjects.Text;
  private ignoreNextInput: boolean;

  constructor() {
    super(UiMode.SETTINGS_GAMEPAD, "gamepad", gamepadSettingsUiItems, Device.GAMEPAD, UiMode.GAMEPAD_BINDING);

    this.bindingText = "Press action to assign"; // TODO: localize
  }

  protected override setup() {
    super.setup();

    // Create text in case no controller is plugged in
    this.noGamepadText = addTextObject(8, 28, i18next.t("settings:gamepadPleasePlug"), TextStyle.SETTINGS_LABEL);
    this.settingsContainer.add(this.noGamepadText);

    // Hide the options until a controller is plugged in
    this.optionsContainer.setVisible(false);

    // Listen to gamepad init event
    eventBus.on("gamepad/init", this.updateChosenGamepadDisplay, this);
  }

  protected override tearDown(): void {
    eventBus.off("gamepad/init", this.updateChosenGamepadDisplay, this);
    super.tearDown();
  }

  /**
   * Update the display for the chosen gamepad.
   */
  private updateChosenGamepadDisplay(): void {
    this.noGamepadText.setVisible(false);
    this.optionsContainer.setVisible(true);

    // Update any bindings that might have changed since the last update.
    this.initBindings();
    this.resetScroll();
    this.updateInstructionIcons();
    if (this.active) {
      // if the handler is currently active and we are switching gamepad, ignore its next input to prevent unwanted interactions
      this.ignoreNextInput = true;
      globalScene.ui.playSelect();
    }

    // Iterate over the keys in the settingDevice enumeration.
    for (const [index, key] of Object.keys(SettingGamepad).entries()) {
      if (key === "Controller") {
        // Update the text of the first option label under the current setting to the name of the chosen gamepad,
        // truncating the name to 25 charactersif necessary.
        this.updateOptionValueLabel(
          index,
          0,
          truncateString(globalScene.inputController.selectedDevice[Device.GAMEPAD], 25),
        );
      }
    }
  }

  private resetScroll() {
    this.setScrollCursor(0);
    this.setCursor(0);
  }

  protected override handleSaveSetting<V = any>(uiItem: SettingsUiItem, newValue: V): void {
    if (uiItem.key === SettingGamepad.Controller) {
      if (newValue) {
        const gp = globalScene.inputController.getGamepadsName();
        if (globalScene.ui && gp) {
          const cancelHandler = () => {
            globalScene.ui.revertMode();
            const handler = globalScene.ui.getCurrentHandler<GamepadSettingsUiHandler>();
            handler.setOptionCursor(-1, 0, true);
            return true;
          };
          const changeGamepadHandler = (gamepad: string, index: number) => {
            globalScene.inputController.setChosenGamepad(gamepad);
            settings.update("gamepad", "activeIndex", index);
            cancelHandler();
            return true;
          };
          globalScene.ui.setOverlayMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, {
            options: [
              ...gp.map((g: string, index) => ({
                label: truncateString(g, 40), // Truncate the gamepad name for display
                handler: () => changeGamepadHandler(g, index),
              })),
              {
                label: i18next.t("menu:cancel"),
                handler: cancelHandler,
              },
            ],
            yOffset: 48,
          });
        }
      }
    } else {
      super.handleSaveSetting(uiItem, newValue);
    }
  }

  public override processInput(button: Button): boolean {
    if (this.ignoreNextInput) {
      this.ignoreNextInput = false;
      return false;
    }

    return super.processInput(button);
  }
}
