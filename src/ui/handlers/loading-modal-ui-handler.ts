import { addTextObject } from "#app/ui/text/text-utils";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { ModalUiHandler } from "./modal-ui-handler";

export class LoadingModalUiHandler extends ModalUiHandler {
  constructor(mode: UiMode | null = null) {
    super(mode);
  }

  protected override getModalTitle(): string {
    return "";
  }

  protected override getWidth(): number {
    return 80;
  }

  protected override getHeight(): number {
    return 32;
  }

  protected override getMargin(): [number, number, number, number] {
    return [0, 0, 48, 0];
  }

  protected override getButtonLabels(): string[] {
    return [];
  }

  protected override setup(): void {
    super.setup();

    const label = addTextObject(this.getWidth() / 2, this.getHeight() / 2, i18next.t("menu:loading"), TextStyle.WINDOW);
    label.setOrigin(0.5, 0.5);

    this.modalContainer.add(label);
  }
}
