import { globalScene } from "#app/global-scene";
import { Device } from "#enums/device";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import type { GamepadKeys } from "#types/inputs-types";
import { BindingUiHandler } from "#ui/binding-ui-handler";
import { addTextObject } from "#ui/text-utils";
import { isNil } from "#utils/common-utils";
import { getIconWithSettingName, getKeyWithKeycode } from "#utils/inputs-utils";
import i18next from "i18next";

export class GamepadBindingUiHandler extends BindingUiHandler {
  constructor() {
    super(UiMode.GAMEPAD_BINDING, Device.GAMEPAD);

    this.pressButtonText = i18next.t("settings:pressButton");
    this.buttonPressedText = i18next.t("settings:buttonPressed");
    this.confirmAssignText = i18next.t("settings:confirmSwap");
  }
  protected override setup() {
    super.setup();

    const windowCenterX = this.optionSelectBg.x;
    const windowCenterY = this.optionSelectBg.y;

    // Move the selected icon button up to accomodate the other icon and text
    this.newButtonIcon.setY(this.newButtonIcon.y - 16);

    this.swapText = addTextObject(windowCenterX, windowCenterY, i18next.t("settings:willSwapWith"), TextStyle.WINDOW);
    this.swapText.setOrigin(0.5);
    this.swapText.setVisible(false);

    this.targetButtonIcon = globalScene.add.sprite(windowCenterX, windowCenterY + 16, "xbox");
    this.targetButtonIcon.setOrigin(0.5);
    this.targetButtonIcon.setVisible(false);

    this.optionSelectContainer.add(this.swapText);
    this.optionSelectContainer.add(this.targetButtonIcon);

    // Listen to gamepad button down events to initiate binding.
    globalScene.input.gamepad?.on("down", this.gamepadButtonDown, this);
  }

  protected override tearDown(): void {
    // Remove gamepad listener
    globalScene.input.gamepad?.off("down", this.gamepadButtonDown, this);

    super.tearDown();
  }

  private gamepadButtonDown(
    pad: Phaser.Input.Gamepad.Gamepad,
    button: Phaser.Input.Gamepad.Button,
    _value: number,
  ): void {
    // Check conditions before processing the button press.
    if (
      !this.listening
      || !this.target
      || pad.id.toLowerCase() !== this.getSelectedDevice()
      || this.buttonPressed !== null
    ) {
      return;
    }

    const activeConfig = globalScene.inputController.getActiveConfig(this.device);
    if (!activeConfig) {
      return;
    }

    const key = getKeyWithKeycode(activeConfig, button.index);
    if (isNil(key) || activeConfig.keysBlacklist?.includes(key as GamepadKeys)) {
      return;
    }
    const type = activeConfig.padType;
    const buttonIcon = activeConfig.icons[key];
    if (isNil(buttonIcon)) {
      return;
    }
    this.buttonPressed = button.index;
    const assignedButtonIcon = getIconWithSettingName(activeConfig, this.target);
    if (isNil(assignedButtonIcon)) {
      return;
    }
    this.onInputDown(buttonIcon, assignedButtonIcon, type);
  }

  /**
   * Clear the UI elements and state.
   */
  protected override clear() {
    super.clear();
    this.targetButtonIcon.setVisible(false);
    this.swapText.setVisible(false);
  }
}
