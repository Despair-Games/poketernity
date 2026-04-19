import { eventBus } from "#app/event-bus";
import { globalScene, mpSession, setMpSession } from "#app/global-scene";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import type { PeerReconnectedMessage, SessionEndedMessage } from "#multiplayer/mp-protocol";
import type { ModalConfig } from "#ui/modal-config";
import { ModalUiHandler } from "#ui/modal-ui-handler";
import { addTextObject } from "#ui/text-utils";

/**
 * Non-dismissable modal overlay shown when a multiplayer peer disconnects.
 *
 * Displays a countdown from `graceSeconds` (typically 60s). If the peer
 * reconnects within the grace period the modal is automatically dismissed.
 * Otherwise the player can choose to continue in solo mode or wait for the
 * countdown to expire, which automatically converts to solo.
 */
export class MpReconnectModalUiHandler extends ModalUiHandler {
  private messageLabel: Phaser.GameObjects.Text;
  private countdownLabel: Phaser.GameObjects.Text;

  private peerUsername = "";
  private graceSeconds = 60;
  private remainingSeconds = 60;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  // Bound handlers for cleanup
  private readonly boundOnPeerReconnected: (msg: PeerReconnectedMessage) => void;
  private readonly boundOnSessionEnded: (msg: SessionEndedMessage) => void;

  constructor(mode: UiMode | null = null) {
    super(mode);
    this.boundOnPeerReconnected = this.onPeerReconnected.bind(this);
    this.boundOnSessionEnded = this.onSessionEnded.bind(this);
  }

  protected override getModalTitle(): string {
    return "Peer Disconnected";
  }

  protected override getWidth(): number {
    return 220;
  }

  protected override getHeight(): number {
    return 80;
  }

  protected override getMargin(): [number, number, number, number] {
    return [0, 0, 48, 0];
  }

  protected override getButtonLabels(): string[] {
    return ["Continue Solo"];
  }

  protected override setup(): void {
    super.setup();

    this.messageLabel = addTextObject(this.getWidth() / 2, 30, "", TextStyle.WINDOW_MODAL_INFO, { align: "center" });
    this.messageLabel.setOrigin(0.5, 0);
    this.modalContainer.add(this.messageLabel);

    this.countdownLabel = addTextObject(this.getWidth() / 2, 48, "", TextStyle.WINDOW_MODAL_INFO, { align: "center" });
    this.countdownLabel.setOrigin(0.5, 0);
    this.modalContainer.add(this.countdownLabel);
  }

  /**
   * Show the reconnection modal.
   *
   * @param peerUsername - Display name of the disconnected peer
   * @param graceSeconds - Seconds to wait before auto-converting to solo
   */
  public override show(peerUsername: string, graceSeconds?: number): boolean {
    this.peerUsername = peerUsername || "Peer";
    this.graceSeconds = graceSeconds ?? 60;
    this.remainingSeconds = this.graceSeconds;

    const config: ModalConfig = {
      buttonActions: [() => this.continueSolo()],
    };

    if (!super.show(config)) {
      return false;
    }

    this.updateDisplay();
    this.startCountdown();

    // Listen for peer reconnection and session end
    eventBus.on("mp:peer-reconnected" as any, this.boundOnPeerReconnected);
    eventBus.on("mp:session-ended" as any, this.boundOnSessionEnded);

    return true;
  }

  public override processInput(): boolean {
    // Non-dismissable — block all input except the button
    return false;
  }

  // --- Countdown ---

  private startCountdown(): void {
    this.stopCountdown();

    this.countdownTimer = setInterval(() => {
      this.remainingSeconds--;
      this.updateDisplay();

      if (this.remainingSeconds <= 0) {
        this.continueSolo();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownTimer !== null) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private updateDisplay(): void {
    this.messageLabel.setText(`${this.peerUsername} disconnected.`);
    this.countdownLabel.setText(`Waiting for reconnection... (${this.remainingSeconds}s)`);
  }

  // --- Event handlers ---

  private onPeerReconnected(msg: PeerReconnectedMessage): void {
    if (msg.peerId && mpSession) {
      // Peer is back — dismiss the overlay
      globalScene.audioManager.playSound("se/pb_bounce_1");
      this.dismiss();
    }
  }

  private onSessionEnded(_msg: SessionEndedMessage): void {
    // Session was ended server-side; dismiss and let other systems handle cleanup
    this.dismiss();
  }

  // --- Actions ---

  private async continueSolo(): Promise<void> {
    this.stopCountdown();

    // Notify server we're converting to solo
    try {
      await mpSession?.client?.convertToSolo();
    } catch (error) {
      console.error("[MpReconnect] Failed to notify server of solo conversion:", error);
    }

    // Tear down the multiplayer session locally
    mpSession?.end();
    mpSession?.reset();
    setMpSession(undefined);

    this.dismiss();
  }

  private dismiss(): void {
    this.clear();
    globalScene.ui.revertMode();
  }

  protected override clear(): void {
    this.stopCountdown();

    eventBus.off("mp:peer-reconnected" as any, this.boundOnPeerReconnected);
    eventBus.off("mp:session-ended" as any, this.boundOnSessionEnded);

    super.clear();
  }
}
