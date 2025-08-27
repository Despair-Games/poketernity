import { globalScene } from "#app/global-scene";
import { Button } from "#enums/button";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import { WindowVariant } from "#enums/window-variant";
import type { AnyFn } from "#types/utility-types";
import type { FormModalConfig, InputFieldConfig, ModalConfig } from "#ui/modal-config";
import { ModalUiHandler } from "#ui/modal-ui-handler";
import { addTextInputObject, addTextObject } from "#ui/text-utils";
import { addWindow } from "#ui/ui-theme";
import { fixedNumber } from "#utils/common-utils";
import type InputText from "phaser3-rex-plugins/plugins/inputtext";

export abstract class FormModalUiHandler extends ModalUiHandler {
  protected editing: boolean;
  protected inputContainers: Phaser.GameObjects.Container[];
  protected inputs: InputText[];
  protected errorMessage: Phaser.GameObjects.Text;
  protected submitAction: AnyFn | null;
  protected tween: Phaser.Tweens.Tween;
  protected formLabels: Phaser.GameObjects.Text[];

  protected labelTextStyle: TextStyle;
  protected errorMessageTextStyle: TextStyle;

  constructor(
    mode: UiMode | null = null,
    labelStyle: TextStyle = TextStyle.TOOLTIP_CONTENT,
    errorMessageStyle: TextStyle = TextStyle.WINDOW_MODAL_ERROR,
  ) {
    super(mode);

    this.editing = false;
    this.inputContainers = [];
    this.inputs = [];
    this.formLabels = [];

    this.labelTextStyle = labelStyle;
    this.errorMessageTextStyle = errorMessageStyle;
  }

  /**
   * Get configuration for all fields that should be part of the modal
   * Gets used by {@linkcode updateFields} to add the proper text inputs and labels to the view
   * @returns array of {@linkcode InputFieldConfig}
   */
  protected abstract getInputFieldConfigs(): InputFieldConfig[];

  protected override getHeight(config?: ModalConfig): number {
    return (
      20 * this.getInputFieldConfigs().length
      + (this.getModalTitle() ? 26 : 0)
      + ((config as FormModalConfig)?.errorMessage ? 12 : 0)
      + this.getButtonTopMargin()
      + 28
    );
  }

  protected getReadableErrorMessage(error: string): string {
    if (error?.indexOf("connection refused") > -1) {
      return "Could not connect to the server";
    }

    return error;
  }

  protected override setup(): void {
    super.setup();

    const config = this.getInputFieldConfigs();

    const hasTitle = !!this.getModalTitle();

    if (config.length >= 1) {
      this.updateFields(config, hasTitle);
    }

    const errorMessageY = (hasTitle ? 31 : 5) + 20 * (config.length - 1) + 16 + this.getButtonTopMargin();
    this.errorMessage = addTextObject(10, errorMessageY, "", this.errorMessageTextStyle);
    this.errorMessage.setVisible(false);
    this.modalContainer.add(this.errorMessage);
  }

  protected updateFields(fieldsConfig: InputFieldConfig[], hasTitle: boolean) {
    // TODO: should destroy existing container and inputs, or reuse them
    this.inputContainers = [];
    this.inputs = [];
    this.formLabels = [];
    fieldsConfig.forEach((config, f) => {
      const label = addTextObject(10, (hasTitle ? 31 : 5) + 20 * f, config.label, this.labelTextStyle);
      label.name = "formLabel" + f;

      this.formLabels.push(label);
      this.modalContainer.add(label);

      const inputContainer = globalScene.add.container(70, (hasTitle ? 28 : 2) + 20 * f);
      inputContainer.setVisible(false);

      const inputBg = addWindow(0, 0, 80, 16, false, false, 0, 0, WindowVariant.XTHIN);

      const isPassword = config?.isPassword;
      const isReadOnly = config?.isReadOnly;
      const input = addTextInputObject(4, -2, 440, 116, TextStyle.TOOLTIP_CONTENT, {
        type: isPassword ? "password" : "text",
        maxLength: isPassword ? 64 : 20,
        readOnly: isReadOnly,
      });
      input.setOrigin(0, 0);

      inputContainer.add(inputBg);
      inputContainer.add(input);

      this.inputContainers.push(inputContainer);
      this.modalContainer.add(inputContainer);

      this.inputs.push(input);
    });
  }

  public override show(config: FormModalConfig, ..._args: unknown[]): boolean {
    if (!super.show(config)) {
      return false;
    }

    this.inputContainers.map((ic) => ic.setVisible(true));

    this.submitAction = config.buttonActions.length ? config.buttonActions[0] : null;

    if (this.buttonBgs.length) {
      this.buttonBgs[0].off("pointerdown");
      this.buttonBgs[0].on("pointerdown", () => {
        if (this.submitAction) {
          this.submitAction();
        }
      });
    }

    this.modalContainer.y += 24;
    this.modalContainer.setAlpha(0);

    this.tween = globalScene.tweens.add({
      targets: this.modalContainer,
      duration: fixedNumber(1000),
      ease: "Sine.easeInOut",
      y: "-=24",
      alpha: 1,
    });

    return true;
  }

  public override processInput(button: Button): boolean {
    if (button === Button.SUBMIT && this.submitAction) {
      this.submitAction();
      return true;
    }

    return false;
  }

  protected sanitizeInputs(): void {
    for (const input of this.inputs) {
      input.text = input.text.trim();
    }
  }

  protected override updateContainer(config?: ModalConfig): void {
    super.updateContainer(config);

    this.errorMessage.setText(this.getReadableErrorMessage((config as FormModalConfig)?.errorMessage || ""));
    this.errorMessage.setVisible(!!this.errorMessage.text);
  }

  protected override clear(): void {
    super.clear();
    this.modalContainer.setVisible(false);

    this.inputContainers.map((ic) => ic.setVisible(false));

    this.submitAction = null;

    if (this.tween) {
      this.tween.remove();
    }
  }
}
