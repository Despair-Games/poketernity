import type { PlayerPokemon } from "#app/field/pokemon";
import type { InputFieldConfig, ModalConfig } from "#app/ui/interfaces/modal-config";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { FormModalUiHandler } from "./form-modal-ui-handler";

export class RenamePokemonUiHandler extends FormModalUiHandler {
  constructor() {
    super(UiMode.RENAME_POKEMON);
  }

  getModalTitle(): string {
    return i18next.t("menu:renamePokemon");
  }

  getWidth(): number {
    return 160;
  }

  getMargin(): [number, number, number, number] {
    return [0, 0, 48, 0];
  }

  getButtonLabels(): string[] {
    return [i18next.t("menu:rename"), i18next.t("menu:cancel")];
  }

  override getReadableErrorMessage(error: string): string {
    const colonIndex = error?.indexOf(":");
    if (colonIndex > 0) {
      error = error.slice(0, colonIndex);
    }

    return super.getReadableErrorMessage(error);
  }

  override getInputFieldConfigs(): InputFieldConfig[] {
    return [{ label: i18next.t("menu:nickname") }];
  }

  override show(config: ModalConfig, target: string | PlayerPokemon): boolean {
    if (!super.show(config)) {
      return false;
    }

    if (typeof target === "string") {
      this.inputs[0].text = target;
    } else {
      this.inputs[0].text = target.getNameToRender();
    }
    this.submitAction = (_) => {
      this.sanitizeInputs();
      const sanitizedName = btoa(unescape(encodeURIComponent(this.inputs[0].text)));
      config.buttonActions[0](sanitizedName);
      return true;
    };
    return true;
  }
}
