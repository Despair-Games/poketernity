import { globalScene } from "#app/global-scene";
import { Device } from "#enums/device";
import { UiMode } from "#enums/ui-mode";
import type { KeyboardKeys } from "#types/inputs-types";
import { BindingUiHandler } from "#ui/binding-ui-handler";
import { isNil } from "#utils/common-utils";
import { getKeyWithKeycode } from "#utils/inputs-utils";
import i18next from "i18next";

export class KeyboardBindingUiHandler extends BindingUiHandler {
  constructor() {
    super(UiMode.KEYBOARD_BINDING, Device.KEYBOARD);

    this.pressButtonText = i18next.t("settings:pressKey");
    this.buttonPressedText = i18next.t("settings:keyPressed");
    this.confirmAssignText = i18next.t("settings:confirmAssign");
  }

  protected override setup() {
    super.setup();

    // Listen to keyboard button down events to initiate binding.
    globalScene.input.keyboard?.on("keydown", this.onKeyDown, this);
  }

  protected override tearDown(): void {
    // Remove keyboard listener
    globalScene.input.keyboard?.off("keydown", this.onKeyDown, this);

    super.tearDown();
  }

  private onKeyDown(event): void {
    const keyCode = event.keyCode;
    // // Check conditions before processing the button press.
    if (!this.listening || this.buttonPressed !== null) {
      return;
    }

    const activeConfig = globalScene.inputController.getActiveConfig(Device.KEYBOARD);
    if (!activeConfig) {
      return;
    }

    const key = getKeyWithKeycode(activeConfig, keyCode);
    if (isNil(key) || activeConfig.keysBlacklist?.includes(key as KeyboardKeys)) {
      return;
    }

    const buttonIcon = activeConfig.icons[key];
    if (!buttonIcon) {
      return;
    }
    this.buttonPressed = keyCode;
    this.onInputDown(buttonIcon, null, "keyboard");
  }
}
