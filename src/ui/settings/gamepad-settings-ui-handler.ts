import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import type { Button } from "#enums/button";
import { Device } from "#enums/device";
import { SettingGamepad } from "#enums/setting-gamepad";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import type { SettingsUiItem } from "#types/settings";
import { ControlsSettingsUiHandler } from "#ui/controls-settings-ui-handler";
import type { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import { gamepadSettingsUiItems } from "#ui/settings-ui-items";
import { truncateString } from "#utils/string-utils";
import i18next from "i18next";

/**
 * Class representing the settings UI handler for gamepads.
 */
export class GamepadSettingsUiHandler extends ControlsSettingsUiHandler {
  private ignoreNextInput: boolean;

  constructor() {
    super(UiMode.SETTINGS_GAMEPAD, "gamepad", gamepadSettingsUiItems, Device.GAMEPAD, UiMode.GAMEPAD_BINDING);

    this.plugInText = i18next.t("settings:gamepadPleasePlug");
  }

  protected override setup() {
    super.setup();

    // Listen to gamepad init event
    eventBus.on("gamepad/init", this.updateChosenGamepadDisplay, this);
  }

  protected override tearDown(): void {
    eventBus.off("gamepad/init", this.updateChosenGamepadDisplay, this);
    super.tearDown();
  }

  public override show(): boolean {
    if (super.show()) {
      // If a gamepad is connected but the view hasn't been initialized for it, do it
      if (this.noDeviceText.visible && globalScene.inputController.getActiveConfig(this.device)) {
        this.updateChosenGamepadDisplay();
      }
      return true;
    }
    return false;
  }

  /**
   * Update the display for the chosen gamepad.
   *
   * TODO: should we really switch the view if the gamepad is not the one with activeIndex?
   * activeIndex is not actually being used right now
   */
  private updateChosenGamepadDisplay(): void {
    this.noDeviceText.setVisible(false);
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
    const deviceId = globalScene.inputController.selectedDevice[Device.GAMEPAD];
    for (const [index, key] of Object.keys(SettingGamepad).entries()) {
      if (key === "Controller" && deviceId) {
        // Update the text of the first option label under the current setting to the name of the chosen gamepad,
        // truncating the name to 25 charactersif necessary.
        this.updateOptionValueLabel(index, 0, truncateString(deviceId, 25));
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
        const gamepad = globalScene.inputController.getGamepadsName();
        if (globalScene.ui && gamepad) {
          const cancelHandler = () => {
            globalScene.ui.revertMode();
            this.setOptionCursor(-1, 0);
            return true;
          };
          const changeGamepadHandler = (gamepad: string, index: number) => {
            globalScene.inputController.setChosenGamepad(gamepad);
            settings.update("gamepad", "activeIndex", index);
            return cancelHandler();
          };
          globalScene.ui.setOverlayMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, {
            options: [
              ...gamepad.map((g: string, index) => ({
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
