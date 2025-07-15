import { globalScene } from "#app/global-scene";
import { Device } from "#enums/device";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { getKeyWithKeycode } from "#inputs/config-handler";
import { KeyboardKeys } from "#types/input-interface-config";
import { BindingUiHandler } from "#ui/binding-ui-handler";
import { addTextObject } from "#ui/text-utils";
import { isNil } from "#utils/common-utils";

export class KeyboardBindingUiHandler extends BindingUiHandler {
  constructor() {
    super(UiMode.KEYBOARD_BINDING, Device.KEYBOARD);
  }

  protected override setup() {
    super.setup();

    // New button icon setup.
    this.newButtonIcon = globalScene.add.sprite(0, 0, "keyboard");
    this.newButtonIcon.setPositionRelative(this.optionSelectBg, 78, 32);
    this.newButtonIcon.setOrigin(0.5);
    this.newButtonIcon.setVisible(false);

    this.actionLabel = addTextObject(0, 0, "Assign button", TextStyle.SETTINGS_LABEL);
    this.actionLabel.setOrigin(0, 0.5);
    this.actionLabel.setPositionRelative(this.actionBg, this.actionBg.width - 80, this.actionBg.height / 2);
    this.actionsContainer.add(this.actionLabel);

    this.optionSelectContainer.add(this.newButtonIcon);

    // Listen to keyboard button down events to initiate binding.
    globalScene.input.keyboard?.on("keydown", this.onKeyDown, this);
  }

  protected override tearDown(): void {
    // Remove keyboard listener
    globalScene.input.keyboard?.off("keydown", this.onKeyDown, this);

    super.tearDown();
  }

  private onKeyDown(event): void {
    const key = event.keyCode;
    // // Check conditions before processing the button press.
    if (!this.listening || this.buttonPressed !== null) {
      return;
    }
    const activeConfig = globalScene.inputController.getActiveConfig(Device.KEYBOARD);
    const _key = getKeyWithKeycode(activeConfig, key);
    if (isNil(_key) || activeConfig.bindingBlacklist?.includes(_key as KeyboardKeys)) {
      console.log("invalid key", _key);
      return;
    }

    const buttonIcon = activeConfig.icons[_key];
    if (!buttonIcon) {
      return;
    }
    this.buttonPressed = key;
    // const assignedButtonIcon = getIconWithSettingName(activeConfig, this.target);
    this.onInputDown(buttonIcon, null, "keyboard");
  }
}
