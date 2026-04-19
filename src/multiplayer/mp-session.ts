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

  private readonly _peers: Map<string, PeerInfo> = new Map();
  private _lobbyParticipants: LobbyParticipantDto[] = [];
  private _currentTurn: number = 0;
  private _currentWave: number = 0;

  get peers(): ReadonlyMap<string, PeerInfo> {
    return this._peers;
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
  }
}
