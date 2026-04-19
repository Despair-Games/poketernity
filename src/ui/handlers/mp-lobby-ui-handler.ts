import { eventBus } from "#app/event-bus";
import { globalScene, mpSession, setMpSession } from "#app/global-scene";
import { SESSION_ID_COOKIE } from "#constants/app-constants";
import { Button } from "#enums/button";
import { GameModes } from "#enums/game-modes";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { WindowVariant } from "#enums/window-variant";
import { MpClient } from "#multiplayer/mp-client";
import { registerMpEventHandlers } from "#multiplayer/mp-event-handler";
import type { LobbyParticipantDto, LobbyUpdateMessage, RunStartedMessage } from "#multiplayer/mp-protocol";
import { setMpSeed } from "#multiplayer/mp-rng";
import { MpSession } from "#multiplayer/mp-session";
import type { TitlePhase } from "#phases/title-phase";
import { FormModalUiHandler } from "#ui/form-modal-ui-handler";
import type { FormModalConfig, InputFieldConfig, ModalConfig } from "#ui/modal-config";
import { addTextObject } from "#ui/text-utils";
import { addWindow } from "#ui/ui-theme";
import { getCookie } from "#utils/app-utils";

type LobbyState = "initial" | "hosting" | "joined";

/**
 * Multiplayer lobby UI handler.
 *
 * Allows creating/joining a lobby via invite code, displays participant list
 * with ready state, and lets the host start the run once everyone is ready.
 */
export class MpLobbyUiHandler extends FormModalUiHandler {
  private lobbyState: LobbyState = "initial";

  // Dynamic UI elements created after setup
  private participantListContainer: Phaser.GameObjects.Container;
  private participantTexts: Phaser.GameObjects.Text[] = [];
  private inviteCodeText: Phaser.GameObjects.Text;
  private statusText: Phaser.GameObjects.Text;

  // Lobby action buttons rendered inside the modal after entering a lobby
  private readyButton: Phaser.GameObjects.NineSlice;
  private readyLabel: Phaser.GameObjects.Text;
  private startButton: Phaser.GameObjects.NineSlice;
  private startLabel: Phaser.GameObjects.Text;
  private leaveButton: Phaser.GameObjects.NineSlice;
  private leaveLabel: Phaser.GameObjects.Text;
  private lobbyButtonContainer: Phaser.GameObjects.Container;

  private isReady = false;
  private mpClient: MpClient | null = null;

  // Bound event handlers for cleanup
  private readonly boundOnLobbyUpdate: (msg: LobbyUpdateMessage) => void;
  private readonly boundOnRunStarted: (msg: RunStartedMessage) => void;

  constructor() {
    super(UiMode.MP_LOBBY);
    this.boundOnLobbyUpdate = this.onLobbyUpdate.bind(this);
    this.boundOnRunStarted = this.onRunStarted.bind(this);
  }

  protected override getModalTitle(): string {
    switch (this.lobbyState) {
      case "hosting":
        return "Hosting Lobby";
      case "joined":
        return "Co-op Lobby";
      default:
        return "Multiplayer";
    }
  }

  protected override getWidth(): number {
    return 150;
  }

  protected override getHeight(_config?: ModalConfig): number {
    if (this.lobbyState === "initial") {
      return 70;
    }
    return 105;
  }

  protected override getMargin(): [number, number, number, number] {
    return [0, 0, 48, 0];
  }

  protected override getButtonLabels(): string[] {
    return ["Create Game", "Join", "Back"];
  }

  protected override getInputFieldConfigs(): InputFieldConfig[] {
    return [{ label: "Invite Code" }];
  }

  protected override setup(): void {
    super.setup();

    // Participant list container (hidden initially)
    this.participantListContainer = globalScene.add.container(10, 50);
    this.participantListContainer.setVisible(false);
    this.modalContainer.add(this.participantListContainer);

    // Invite code display
    this.inviteCodeText = addTextObject(10, 34, "", TextStyle.WINDOW_MODAL_INFO);
    this.inviteCodeText.setVisible(false);
    this.modalContainer.add(this.inviteCodeText);

    // Status text
    this.statusText = addTextObject(10, 34, "", TextStyle.WINDOW_MODAL_INFO);
    this.statusText.setVisible(false);
    this.modalContainer.add(this.statusText);

    // Lobby action buttons container
    this.lobbyButtonContainer = globalScene.add.container(0, 0);
    this.lobbyButtonContainer.setVisible(false);
    this.modalContainer.add(this.lobbyButtonContainer);

    this.createLobbyButtons();
  }

  private createLobbyButtons(): void {
    // Ready button
    this.readyLabel = addTextObject(0, 8, "Ready", TextStyle.TOOLTIP_CONTENT);
    this.readyLabel.setOrigin(0.5, 0.5);
    this.readyButton = addWindow(
      0,
      0,
      this.readyLabel.getBounds().width + 11,
      16,
      false,
      false,
      0,
      0,
      WindowVariant.THIN,
    );
    this.readyButton.setOrigin(0.5, 0);
    this.readyButton.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.readyButton.width, this.readyButton.height),
      Phaser.Geom.Rectangle.Contains,
    );
    this.addInteractionHoverEffect(this.readyButton);

    const readyContainer = globalScene.add.container(25, 0);
    readyContainer.add(this.readyButton);
    readyContainer.add(this.readyLabel);
    this.lobbyButtonContainer.add(readyContainer);

    // Start button (host only)
    this.startLabel = addTextObject(0, 8, "Start", TextStyle.TOOLTIP_CONTENT);
    this.startLabel.setOrigin(0.5, 0.5);
    this.startButton = addWindow(
      0,
      0,
      this.startLabel.getBounds().width + 11,
      16,
      false,
      false,
      0,
      0,
      WindowVariant.THIN,
    );
    this.startButton.setOrigin(0.5, 0);
    this.startButton.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.startButton.width, this.startButton.height),
      Phaser.Geom.Rectangle.Contains,
    );
    this.addInteractionHoverEffect(this.startButton);

    const startContainer = globalScene.add.container(70, 0);
    startContainer.add(this.startButton);
    startContainer.add(this.startLabel);
    this.lobbyButtonContainer.add(startContainer);

    // Leave button
    this.leaveLabel = addTextObject(0, 8, "Leave", TextStyle.TOOLTIP_CONTENT);
    this.leaveLabel.setOrigin(0.5, 0.5);
    this.leaveButton = addWindow(
      0,
      0,
      this.leaveLabel.getBounds().width + 11,
      16,
      false,
      false,
      0,
      0,
      WindowVariant.THIN,
    );
    this.leaveButton.setOrigin(0.5, 0);
    this.leaveButton.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.leaveButton.width, this.leaveButton.height),
      Phaser.Geom.Rectangle.Contains,
    );
    this.addInteractionHoverEffect(this.leaveButton);

    const leaveContainer = globalScene.add.container(115, 0);
    leaveContainer.add(this.leaveButton);
    leaveContainer.add(this.leaveLabel);
    this.lobbyButtonContainer.add(leaveContainer);

    // Wire button events
    this.readyButton.on("pointerdown", () => this.toggleReady());
    this.startButton.on("pointerdown", () => this.handleStart());
    this.leaveButton.on("pointerdown", () => this.handleLeave());
  }

  public override show(config: ModalConfig): boolean {
    // Ensure we have an MpClient
    if (!this.mpClient) {
      this.mpClient = new MpClient();
    }

    this.lobbyState = "initial";
    this.isReady = false;

    if (!super.show(config as FormModalConfig)) {
      return false;
    }

    // Wire the three initial buttons: Create Game, Join, Back
    if (config.buttonActions.length >= 3) {
      // Override button actions to use our lobby logic
      this.buttonBgs[0]?.off("pointerdown");
      this.buttonBgs[0]?.on("pointerdown", () => this.handleCreate());

      this.buttonBgs[1]?.off("pointerdown");
      this.buttonBgs[1]?.on("pointerdown", () => this.handleJoin());

      this.buttonBgs[2]?.off("pointerdown");
      this.buttonBgs[2]?.on("pointerdown", () => this.handleBack());
    }

    // Subscribe to multiplayer events
    eventBus.on("mp:lobby-update" as any, this.boundOnLobbyUpdate);
    eventBus.on("mp:run-started" as any, this.boundOnRunStarted);

    this.updateLobbyView();

    return true;
  }

  public override processInput(button: Button): boolean {
    if (button === Button.CANCEL) {
      if (this.lobbyState === "initial") {
        this.handleBack();
      } else {
        this.handleLeave();
      }
      return true;
    }
    return super.processInput(button);
  }

  // --- Button action handlers ---

  private async handleCreate(): Promise<void> {
    try {
      const session = new MpSession();
      setMpSession(session);

      if (!this.mpClient) {
        this.mpClient = new MpClient();
      }
      session.client = this.mpClient;

      const serverUrl = import.meta.env.VITE_SERVER_URL ?? "";
      const token = getCookie(SESSION_ID_COOKIE);
      await this.mpClient.connect(serverUrl, token);
      await this.mpClient.createLobby({ mode: "coop" });

      this.lobbyState = "hosting";
      session.isHost = true;
      session.status = "lobby";
      this.updateLobbyView();
    } catch (error) {
      console.error("[MpLobby] Failed to create lobby:", error);
      this.showError("Failed to create lobby");
    }
  }

  private async handleJoin(): Promise<void> {
    this.sanitizeInputs();
    const inviteCode = this.inputs[0]?.text?.trim();
    if (!inviteCode) {
      this.showError("Please enter an invite code");
      return;
    }

    try {
      const session = new MpSession();
      setMpSession(session);

      if (!this.mpClient) {
        this.mpClient = new MpClient();
      }
      session.client = this.mpClient;

      const serverUrl = import.meta.env.VITE_SERVER_URL ?? "";
      const token = getCookie(SESSION_ID_COOKIE);
      await this.mpClient.connect(serverUrl, token);
      await this.mpClient.joinLobby({ inviteCode });

      this.lobbyState = "joined";
      session.isHost = false;
      session.status = "lobby";
      this.updateLobbyView();
    } catch (error) {
      console.error("[MpLobby] Failed to join lobby:", error);
      this.showError("Failed to join lobby");
    }
  }

  private handleBack(): void {
    this.clear();
    globalScene.ui.revertMode();
  }

  private async handleLeave(): Promise<void> {
    try {
      await this.mpClient?.leaveLobby();
    } catch (error) {
      console.error("[MpLobby] Error leaving lobby:", error);
    }

    mpSession?.reset();
    setMpSession(undefined);

    this.lobbyState = "initial";
    this.isReady = false;
    this.updateLobbyView();
  }

  private async toggleReady(): Promise<void> {
    this.isReady = !this.isReady;
    try {
      await this.mpClient?.setReady({ ready: this.isReady });
      this.readyLabel.setText(this.isReady ? "Unready" : "Ready");
    } catch (error) {
      console.error("[MpLobby] Error toggling ready:", error);
      this.isReady = !this.isReady;
    }
  }

  private async handleStart(): Promise<void> {
    try {
      await this.mpClient?.startRun();
    } catch (error) {
      console.error("[MpLobby] Error starting run:", error);
      this.showError("Failed to start run");
    }
  }

  // --- Event handlers ---

  private onLobbyUpdate(msg: LobbyUpdateMessage): void {
    if (!mpSession) {
      return;
    }

    mpSession.updateFromLobby(msg);

    // Determine hosting/joined based on participants
    const localUser = msg.participants.find((p) => p.userId === mpSession!.localUserId);
    if (localUser?.isHost) {
      this.lobbyState = "hosting";
    } else if (this.lobbyState === "initial") {
      this.lobbyState = "joined";
    }

    this.updateParticipantList(msg.participants);
    this.updateLobbyView();
  }

  private onRunStarted(msg: RunStartedMessage): void {
    if (!mpSession) {
      return;
    }

    mpSession.startRun(msg);
    mpSession.initSubsystems();

    // Apply the shared seed so both clients generate identical encounters
    setMpSeed(msg.seed);

    // Register global MP event handlers (reconnect overlay, etc.)
    registerMpEventHandlers();

    // Close lobby UI
    this.clear();
    globalScene.ui.revertMode();

    // Trigger the normal game start flow through TitlePhase
    const currentPhase = globalScene.phaseManager.getCurrentPhase();
    if (currentPhase.is("TitlePhase")) {
      const titlePhase = currentPhase as TitlePhase;
      titlePhase.gameMode = GameModes.CLASSIC;
      globalScene.ui.setMessageMode();
      globalScene.ui.clearText();
      titlePhase.end();
    }
  }

  // --- View updates ---

  private updateLobbyView(): void {
    const isInLobby = this.lobbyState !== "initial";

    // Toggle initial form elements vs lobby view
    for (const ic of this.inputContainers) {
      ic.setVisible(!isInLobby);
    }
    for (const label of this.formLabels) {
      label.setVisible(!isInLobby);
    }

    // Toggle initial buttons
    for (const container of this.buttonContainers) {
      container.setVisible(!isInLobby);
    }

    // Toggle lobby elements
    this.participantListContainer.setVisible(isInLobby);
    this.lobbyButtonContainer.setVisible(isInLobby);

    if (isInLobby) {
      // Update invite code display
      const code = mpSession?.inviteCode ?? "";
      if (this.lobbyState === "hosting" && code) {
        this.inviteCodeText.setText(`Invite Code: ${code}`);
        this.inviteCodeText.setVisible(true);
        this.statusText.setVisible(false);
      } else {
        this.inviteCodeText.setVisible(false);
        this.statusText.setText("Waiting for host to start...");
        this.statusText.setVisible(this.lobbyState === "joined");
      }

      // Update start button visibility (host only, all ready)
      const allReady = this.areAllParticipantsReady();
      this.startButton.setVisible(this.lobbyState === "hosting");
      this.startLabel.setVisible(this.lobbyState === "hosting");
      if (this.lobbyState === "hosting") {
        this.startButton.setAlpha(allReady ? 1 : 0.5);
      }

      // Position lobby buttons at bottom
      this.lobbyButtonContainer.setPosition(0, this.getHeight() - 28);
    }

    // Update title
    this.titleText.setText(this.getModalTitle());

    // Resize modal
    this.updateContainer();
  }

  private updateParticipantList(participants: LobbyParticipantDto[]): void {
    // Clear existing participant texts
    for (const text of this.participantTexts) {
      text.destroy();
    }
    this.participantTexts = [];

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      const readyIcon = p.isReady ? "✓" : "○";
      const hostTag = p.isHost ? " (Host)" : "";
      const displayText = `${readyIcon} ${p.username}${hostTag}`;

      const text = addTextObject(0, i * 10, displayText, TextStyle.WINDOW_MODAL_INFO);
      this.participantListContainer.add(text);
      this.participantTexts.push(text);
    }
  }

  private areAllParticipantsReady(): boolean {
    const participants = mpSession?.lobbyParticipants ?? [];
    if (participants.length < 2) {
      return false;
    }
    return participants.every((p) => p.isReady || p.isHost);
  }

  private showError(message: string): void {
    this.errorMessage.setText(message);
    this.errorMessage.setVisible(true);
  }

  protected override clear(): void {
    // Unsubscribe from events
    eventBus.off("mp:lobby-update" as any, this.boundOnLobbyUpdate);
    eventBus.off("mp:run-started" as any, this.boundOnRunStarted);

    // Clean up lobby buttons
    this.readyButton?.off("pointerdown");
    this.startButton?.off("pointerdown");
    this.leaveButton?.off("pointerdown");

    // Clear participant texts
    for (const text of this.participantTexts) {
      text.destroy();
    }
    this.participantTexts = [];

    this.lobbyState = "initial";
    this.isReady = false;

    super.clear();
  }
}
