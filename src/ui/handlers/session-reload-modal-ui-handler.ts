import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import type { ModalConfig } from "#ui/modal-config";
import { ModalUiHandler } from "#ui/modal-ui-handler";
import { addTextObject } from "#ui/text-utils";

export class SessionReloadModalUiHandler extends ModalUiHandler {
  constructor(mode: UiMode | null = null) {
    super(mode);
  }

  protected override getModalTitle(): string {
    return "";
  }

  protected override getWidth(): number {
    return 160;
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

  public override show(): boolean {
    const config: ModalConfig = {
      buttonActions: [],
    };

    return super.show(config);
  }
}
