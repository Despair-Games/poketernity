import { updateUserInfo } from "#app/account";
import { globalScene } from "#app/global-scene";
import { SESSION_ID_COOKIE } from "#constants/app-constants";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import type { ModalConfig } from "#ui/modal-config";
import { ModalUiHandler } from "#ui/modal-ui-handler";
import { addTextObject } from "#ui/text-utils";
import { removeCookie } from "#utils/app-utils";
import i18next from "i18next";

export class UnavailableModalUiHandler extends ModalUiHandler {
  private reconnectTimer: NodeJS.Timeout | null;
  private reconnectDuration: number;
  private reconnectCallback: () => void;

  private readonly minTime = 1000 * 5;
  private readonly maxTime = 1000 * 60 * 5;

  private readonly randVarianceTime = 1000 * 10;

  constructor(mode: UiMode | null = null) {
    super(mode);
    this.reconnectDuration = this.minTime;
  }

  protected override getModalTitle(): string {
    return "";
  }

  protected override getWidth(): number {
    return 160;
  }

  protected override getHeight(): number {
    return 64;
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
      i18next.t("menu:errorServerDown"),
      TextStyle.WINDOW_MODAL_INFO,
      { align: "center" },
    );
    label.setOrigin(0.5, 0.5);

    this.modalContainer.add(label);
  }

  public tryReconnect(): void {
    updateUserInfo().then((response) => {
      if (response[0] || [200, 400].includes(response[1])) {
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        this.reconnectDuration = this.minTime;
        globalScene.audioManager.playSound("se/pb_bounce_1");
        this.reconnectCallback();
      } else if (response[1] === 401) {
        removeCookie(SESSION_ID_COOKIE);
        globalScene.reset(true, true);
      } else {
        this.reconnectDuration = Math.min(this.reconnectDuration * 2, this.maxTime); // Set a max delay so it isn't infinite
        this.reconnectTimer = setTimeout(
          () => this.tryReconnect(),
          // Adds a random factor to avoid pendulum effect during long total breakdown
          this.reconnectDuration + Math.random() * this.randVarianceTime,
        );
      }
    });
  }

  public override show(reconnectCallback: () => void): boolean {
    if (!reconnectCallback) {
      return false;
    }
    const config: ModalConfig = {
      buttonActions: [],
    };

    this.reconnectCallback = reconnectCallback;
    this.reconnectDuration = this.minTime;
    this.reconnectTimer = setTimeout(() => this.tryReconnect(), this.reconnectDuration);

    return super.show(config);
  }
}
