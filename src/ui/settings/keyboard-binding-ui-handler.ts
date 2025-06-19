import { globalScene } from "#app/global-scene";
import { Device } from "#enums/device";
import type { SettingKeyboard } from "#enums/setting-keyboard";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import { getKeyWithKeycode } from "#inputs/config-handler";
import { BindingUiHandler } from "#ui/binding-ui-handler";
import { addTextObject } from "#ui/text-utils";

export class KeyboardBindingUiHandler extends BindingUiHandler {
  constructor(mode: UiMode | null = null) {
    super(mode);
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

  public override show(target: SettingKeyboard, cancelHandler: (success: boolean) => boolean): boolean {
    return super.show(target, cancelHandler);
  }

  private getSelectedDevice() {
    return globalScene.inputController?.selectedDevice[Device.KEYBOARD];
  }

  private onKeyDown(event): void {
    const blacklist = [
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.HOME,
      Phaser.Input.Keyboard.KeyCodes.ENTER,
      Phaser.Input.Keyboard.KeyCodes.ESC,
      Phaser.Input.Keyboard.KeyCodes.DELETE,
    ];
    const key = event.keyCode;
    // // Check conditions before processing the button press.
    if (!this.listening || this.buttonPressed !== null || blacklist.includes(key)) {
      return;
    }
    const activeConfig = globalScene.inputController.getActiveConfig(Device.KEYBOARD);
    const _key = getKeyWithKeycode(activeConfig, key);
    const buttonIcon = activeConfig.icons[_key];
    if (!buttonIcon) {
      return;
    }
    this.buttonPressed = key;
    // const assignedButtonIcon = getIconWithSettingName(activeConfig, this.target);
    this.onInputDown(buttonIcon, null, "keyboard");
  }

  protected override swapAction(): boolean {
    const activeConfig = globalScene.inputController.getActiveConfig(Device.KEYBOARD);
    if (globalScene.inputController.assignBinding(activeConfig, this.target, this.buttonPressed)) {
      globalScene.gameData.saveMappingConfigs(this.getSelectedDevice(), activeConfig);
      return true;
    }
    return false;
  }
}
