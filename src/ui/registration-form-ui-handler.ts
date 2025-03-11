import type { InputFieldConfig } from "./form-modal-ui-handler";
import { FormModalUiHandler } from "./form-modal-ui-handler";
import type { ModalConfig } from "./modal-ui-handler";
import { UiMode } from "#enums/ui-mode";
import { addTextObject } from "./text";
import { TextStyle } from "#enums/text-style";
import i18next from "i18next";
import { api } from "#app/plugins/api/api";
import { globalScene } from "#app/global-scene";

export default class RegistrationFormUiHandler extends FormModalUiHandler {
  constructor() {
    super(UiMode.REGISTRATION_FORM, TextStyle.REGISTRATION_FORM_LABEL, TextStyle.REGISTRATION_FORM_ERROR);
  }

  getModalTitle(_config?: ModalConfig): string {
    return i18next.t("menu:register");
  }

  getWidth(_config?: ModalConfig): number {
    return 160;
  }

  getMargin(_config?: ModalConfig): [number, number, number, number] {
    return [0, 0, 48, 0];
  }

  override getButtonTopMargin(): number {
    return 8;
  }

  getButtonLabels(_config?: ModalConfig): string[] {
    return [i18next.t("menu:register"), i18next.t("menu:backToLogin")];
  }

  override getReadableErrorMessage(error: string): string {
    const colonIndex = error?.indexOf(":");
    if (colonIndex > 0) {
      error = error.slice(0, colonIndex);
    }
    switch (error) {
      case "empty username":
        return i18next.t("menu:emptyUsername");
      case "invalid username":
        return i18next.t("menu:invalidRegisterUsername");
      case "invalid password":
        return i18next.t("menu:invalidRegisterPassword");
      case "password doesn't match":
        return i18next.t("menu:passwordNotMatchingConfirmPassword");
      case "failed to add account record":
        return i18next.t("menu:usernameAlreadyUsed");
    }

    return super.getReadableErrorMessage(error);
  }

  override getInputFieldConfigs(): InputFieldConfig[] {
    const inputFieldConfigs: InputFieldConfig[] = [];
    inputFieldConfigs.push({ label: i18next.t("menu:username") });
    inputFieldConfigs.push({ label: i18next.t("menu:password"), isPassword: true });
    inputFieldConfigs.push({ label: i18next.t("menu:confirmPassword"), isPassword: true });
    return inputFieldConfigs;
  }

  override setup(): void {
    super.setup();

    const label = addTextObject(10, 87, i18next.t("menu:registrationAgeWarning"), TextStyle.REGISTRATION_FORM_WARNING);

    this.modalContainer.add(label);
  }

  override show(args: any[]): boolean {
    if (super.show(args)) {
      const config = args[0] as ModalConfig;

      const originalRegistrationAction = this.submitAction;
      this.submitAction = (_) => {
        // Prevent overlapping overrides on action modification
        this.submitAction = originalRegistrationAction;
        this.sanitizeInputs();
        globalScene.ui.setMode(UiMode.LOADING, { buttonActions: [] });
        const onFail = (error: string) => {
          const message = this.getReadableErrorMessage(error);
          globalScene.ui.setMode(UiMode.REGISTRATION_FORM, Object.assign(config, { errorMessage: message.trim() }));
          globalScene.ui.playError();
        };
        if (!this.inputs[0].text) {
          return onFail("empty username");
        }
        if (!this.inputs[1].text) {
          return onFail("invalid password");
        }
        if (this.inputs[1].text !== this.inputs[2].text) {
          return onFail("password doesn't match");
        }
        const [usernameInput, passwordInput] = this.inputs;
        api.account.register({ username: usernameInput.text, password: passwordInput.text }).then((registerError) => {
          if (!registerError) {
            api.account.login({ username: usernameInput.text, password: passwordInput.text }).then((loginError) => {
              if (!loginError) {
                originalRegistrationAction && originalRegistrationAction();
              } else {
                onFail(loginError);
              }
            });
          } else {
            onFail(registerError);
          }
        });
      };

      return true;
    }

    return false;
  }
}
