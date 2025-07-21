import { globalScene } from "#app/global-scene";
import { Device } from "#enums/device";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { getIconWithSettingName, getKeyWithKeycode } from "#inputs/config-handler";
import type { GamepadKeys } from "#types/input-types";
import { BindingUiHandler } from "#ui/binding-ui-handler";
import { addTextObject } from "#ui/text-utils";
import { isNil } from "#utils/common-utils";

export class GamepadBindingUiHandler extends BindingUiHandler {
  constructor() {
    super(UiMode.GAMEPAD_BINDING, Device.GAMEPAD);
  }
  protected override setup() {
    super.setup();

    // New button icon setup.
    this.newButtonIcon = globalScene.add.sprite(0, 0, "xbox");
    this.newButtonIcon.setPositionRelative(this.optionSelectBg, 78, 16);
    this.newButtonIcon.setOrigin(0.5);
    this.newButtonIcon.setVisible(false);

    this.swapText = addTextObject(0, 0, "will swap with", TextStyle.WINDOW);
    this.swapText.setOrigin(0.5);
    this.swapText.setPositionRelative(
      this.optionSelectBg,
      this.optionSelectBg.width / 2 - 2,
      this.optionSelectBg.height / 2 - 2,
    );
    this.swapText.setVisible(false);

    this.targetButtonIcon = globalScene.add.sprite(0, 0, "xbox");
    this.targetButtonIcon.setPositionRelative(this.optionSelectBg, 78, 48);
    this.targetButtonIcon.setOrigin(0.5);
    this.targetButtonIcon.setVisible(false);

    this.actionLabel = addTextObject(0, 0, "Confirm swap", TextStyle.SETTINGS_LABEL);
    this.actionLabel.setOrigin(0, 0.5);
    this.actionLabel.setPositionRelative(this.actionBg, this.actionBg.width - 75, this.actionBg.height / 2);
    this.actionsContainer.add(this.actionLabel);

    this.optionSelectContainer.add(this.newButtonIcon);
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
    if (!this.listening || pad.id.toLowerCase() !== this.getSelectedDevice() || this.buttonPressed !== null) {
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
