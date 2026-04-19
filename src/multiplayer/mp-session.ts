import type { MpClient } from "./mp-client";
import { MpCommandSync } from "./mp-command-sync";
import { MpDesyncGuard } from "./mp-desync-guard";
import { MpPhaseGate } from "./mp-phase-gate";
import type { LobbyParticipantDto, LobbyUpdateMessage, PeerInfo, RunStartedMessage } from "./mp-protocol";

export type MpSessionStatus = "disconnected" | "lobby" | "ready" | "active" | "spectating" | "ended";

export class MpSession {
  public sessionId: string = "";
  public inviteCode: string = "";
  public seed: string = "";
  public status: MpSessionStatus = "disconnected";
  public localUserId: string = "";
  public localUsername: string = "";
  public isHost: boolean = false;
  public clientBuildHash: string = "";

  private _client: MpClient | null = null;
  private readonly _peers: Map<string, PeerInfo> = new Map();
  private _lobbyParticipants: LobbyParticipantDto[] = [];
  private _currentTurn: number = 0;
  private _currentWave: number = 0;

  private _phaseGate: MpPhaseGate | null = null;
  private _commandSync: MpCommandSync | null = null;
  private _desyncGuard: MpDesyncGuard | null = null;

  get peers(): ReadonlyMap<string, PeerInfo> {
    return this._peers;
  }

  get client(): MpClient | null {
    return this._client;
  }

  set client(value: MpClient | null) {
    this._client = value;
  }

  get lobbyParticipants(): readonly LobbyParticipantDto[] {
    return this._lobbyParticipants;
  }

  get currentTurn(): number {
    return this._currentTurn;
  }

  get currentWave(): number {
    return this._currentWave;
  }

  get phaseGate(): MpPhaseGate | null {
    return this._phaseGate;
  }

  get commandSync(): MpCommandSync | null {
    return this._commandSync;
  }

  get desyncGuard(): MpDesyncGuard | null {
    return this._desyncGuard;
  }

  get partnerId(): string | undefined {
    const ids = [...this._peers.keys()];
    return ids.find((id) => id !== this.localUserId);
  }

  get partnerInfo(): PeerInfo | undefined {
    const partnerId = this.partnerId;
    return partnerId ? this._peers.get(partnerId) : undefined;
  }

  get isActive(): boolean {
    return this.status === "active" || this.status === "spectating";
  }

  get isInLobby(): boolean {
    return this.status === "lobby" || this.status === "ready";
  }

  /**
   * Initialize the multiplayer subsystems (phase gate, command sync, desync guard).
   * Should be called after the session transitions to active state.
   */
  initSubsystems(): void {
    this._desyncGuard = new MpDesyncGuard();
    this._commandSync = new MpCommandSync();
    this._phaseGate = new MpPhaseGate(this, this._commandSync, this._desyncGuard);
  }

  updateFromLobby(msg: LobbyUpdateMessage): void {
    this.sessionId = msg.sessionId;
    this.inviteCode = msg.inviteCode;
    this._lobbyParticipants = msg.participants;
    this.status = msg.status === "starting" ? "active" : "lobby";
  }

  startRun(msg: RunStartedMessage): void {
    this.sessionId = msg.sessionId;
    this.seed = msg.seed;
    this.clientBuildHash = msg.clientBuildHash;
    this._peers.clear();
    for (const peer of msg.peers) {
      this._peers.set(peer.userId, peer);
      if (peer.userId === this.localUserId) {
        this.isHost = peer.isHost;
      }
    }
    this.status = "active";
    this._currentTurn = 0;
    this._currentWave = 1;
  }

  advanceTurn(): void {
    this._currentTurn++;
  }

  setWave(wave: number): void {
    this._currentWave = wave;
  }

  enterSpectatorMode(): void {
    this.status = "spectating";
  }

  exitSpectatorMode(): void {
    this.status = "active";
  }

  end(): void {
    this.status = "ended";
  }

  reset(): void {
    this.sessionId = "";
    this.inviteCode = "";
    this.seed = "";
    this.status = "disconnected";
    this.isHost = false;
    this._peers.clear();
    this._lobbyParticipants = [];
    this._currentTurn = 0;
    this._currentWave = 0;

    this._phaseGate?.reset();
    this._commandSync?.reset();
    this._desyncGuard?.reset();
    this._phaseGate = null;
    this._commandSync = null;
    this._desyncGuard = null;
  }
}
