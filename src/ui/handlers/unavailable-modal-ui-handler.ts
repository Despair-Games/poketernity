import { updateUserInfo } from "#app/account";
import { SESSION_ID_COOKIE } from "#app/constants";
import { globalScene } from "#app/global-scene";
import type { ModalConfig } from "#app/ui/interfaces/modal-config";
import { addTextObject } from "#app/ui/text/text-utils";
import { removeCookie } from "#app/utils";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { ModalUiHandler } from "./modal-ui-handler";

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

  getModalTitle(): string {
    return "";
  }

  getWidth(): number {
    return 160;
  }

  getHeight(): number {
    return 64;
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
      i18next.t("menu:errorServerDown"),
      TextStyle.WINDOW_MODAL_INFO,
      { align: "center" },
    );
    label.setOrigin(0.5, 0.5);

    this.modalContainer.add(label);
  }

  tryReconnect(): void {
    updateUserInfo().then((response) => {
      if (response[0] || [200, 400].includes(response[1])) {
        this.reconnectTimer = null;
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

  override show(reconnectCallback: () => void): boolean {
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
