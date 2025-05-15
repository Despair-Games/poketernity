import { UiMode } from "#enums/ui-mode";
import type { PlayerPokemon } from "#field/player-pokemon";
import { FormModalUiHandler } from "#ui/form-modal-ui-handler";
import type { InputFieldConfig, ModalConfig } from "#ui/modal-config";
import i18next from "i18next";

export class RenamePokemonUiHandler extends FormModalUiHandler {
  constructor() {
    super(UiMode.RENAME_POKEMON);
  }

  protected override getModalTitle(): string {
    return i18next.t("menu:renamePokemon");
  }

  protected override getWidth(): number {
    return 160;
  }

  protected override getMargin(): [number, number, number, number] {
    return [0, 0, 48, 0];
  }

  protected override getButtonLabels(): string[] {
    return [i18next.t("menu:rename"), i18next.t("menu:cancel")];
  }

  protected override getReadableErrorMessage(error: string): string {
    const colonIndex = error?.indexOf(":");
    if (colonIndex > 0) {
      error = error.slice(0, colonIndex);
    }

    return super.getReadableErrorMessage(error);
  }

  protected override getInputFieldConfigs(): InputFieldConfig[] {
    return [{ label: i18next.t("menu:nickname") }];
  }

  public override show(config: ModalConfig, target: string | PlayerPokemon): boolean {
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
