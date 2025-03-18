import type { ModalConfig } from "#app/ui/interfaces/modal-config";
import { addTextObject } from "#app/ui/text/text-utils";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import { ModalUiHandler } from "./modal-ui-handler";

export class SessionReloadModalUiHandler extends ModalUiHandler {
  constructor(mode: UiMode | null = null) {
    super(mode);
  }

  getModalTitle(): string {
    return "";
  }

  getWidth(): number {
    return 160;
  }

  getHeight(): number {
    return 32;
  }

  getMargin(): [number, number, number, number] {
    return [0, 0, 48, 0];
  }

  getButtonLabels(): string[] {
    return [];
  }

  override setup(): void {
    super.setup();

    const label = addTextObject(
      this.getWidth() / 2,
      this.getHeight() / 2,
      "Your session is out of date.\nYour data will be reloaded…", // TODO: localize
      TextStyle.WINDOW_MODAL_INFO,
      { align: "center" },
    );
    label.setOrigin(0.5, 0.5);

    this.modalContainer.add(label);
  }

  override show(): boolean {
    const config: ModalConfig = {
      buttonActions: [],
    };

    return super.show(config);
  }
}
