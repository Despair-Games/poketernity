import { eventBus } from "#app/event-bus";
import type {
  CreateLobbyRequest,
  DecisionResolvedMessage,
  DesyncDetectedMessage,
  JoinLobbyRequest,
  LobbyUpdateMessage,
  PeerDisconnectedMessage,
  PeerReconnectedMessage,
  RunStartedMessage,
  SelfIdentifyMessage,
  SessionEndedMessage,
  SetReadyRequest,
  StartersResolvedMessage,
  SubmitCommandRequest,
  SubmitDecisionRequest,
  SubmitStartersRequest,
  TurnResolvedMessage,
} from "./mp-protocol";

export type MpConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting";

/**
 * SignalR client wrapper for multiplayer communication.
 *
 * This class manages the WebSocket connection to the server's /hubs/mp endpoint
 * and translates SignalR messages into event bus events for the rest of the client.
 *
 * Note: Actual SignalR client library (@microsoft/signalr) must be added as a dependency.
 * This implementation uses a thin abstraction that will be connected to SignalR.
 */
export class MpClient {
  private _state: MpConnectionState = "disconnected";
  private readonly _hubUrl: string;
  private _accessToken: string = "";
  private _connection: any = null; // HubConnection from @microsoft/signalr

  constructor(hubUrl: string = "/hubs/mp") {
    this._hubUrl = hubUrl;
    this._setupEventForwarding();
  }

  get state(): MpConnectionState {
    return this._state;
  }

  /**
   * Connect to the multiplayer hub.
   */
  async connect(serverUrl: string, accessToken: string): Promise<void> {
    this._accessToken = accessToken;
    this._state = "connecting";

    try {
      // Dynamic import to avoid bundling SignalR when not needed
      const signalR = await import("@microsoft/signalr");

      // Extract the origin from the server URL (strip /api/v1 or similar path prefixes)
      const baseUrl = serverUrl ? new URL(serverUrl).origin : "";

      this._connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}${this._hubUrl}`, {
          accessTokenFactory: () => this._accessToken,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .build();

      this._registerServerHandlers();
      this._registerConnectionEvents();

      await this._connection.start();
      this._state = "connected";
      eventBus.emit("mp:connected" as any);
    } catch (error) {
      this._state = "disconnected";
      console.error("[MpClient] Connection failed:", error);
      eventBus.emit("mp:connection-error" as any, error);
      throw error;
    }
  }

  /**
   * Disconnect from the multiplayer hub.
   */
  async disconnect(): Promise<void> {
    if (this._connection) {
      await this._connection.stop();
      this._connection = null;
    }
    this._state = "disconnected";
    eventBus.emit("mp:disconnected" as any);
  }

  // --- Client → Server RPC methods ---

  async createLobby(request: CreateLobbyRequest): Promise<void> {
    await this._invoke("CreateLobby", request);
  }

  async joinLobby(request: JoinLobbyRequest): Promise<void> {
    await this._invoke("JoinLobby", request);
  }

  async leaveLobby(): Promise<void> {
    await this._invoke("LeaveLobby");
  }

  async setReady(request: SetReadyRequest): Promise<void> {
    await this._invoke("SetReady", request);
  }

  async startRun(): Promise<void> {
    await this._invoke("StartRun");
  }

  async submitCommand(request: SubmitCommandRequest): Promise<void> {
    await this._invoke("SubmitCommand", request);
  }

  async submitStarters(request: SubmitStartersRequest): Promise<void> {
    await this._invoke("SubmitStarters", request);
  }

  async heartbeat(): Promise<void> {
    await this._invoke("Heartbeat");
  }

  async submitDecision(request: SubmitDecisionRequest): Promise<void> {
    await this._invoke("SubmitDecision", request);
  }

  async convertToSolo(): Promise<void> {
    await this._invoke("ConvertToSolo");
  }

  // --- Private methods ---

  private async _invoke(method: string, ...args: any[]): Promise<void> {
    if (!this._connection || this._state !== "connected") {
      throw new Error(`[MpClient] Cannot invoke ${method}: not connected`);
    }
    await this._connection.invoke(method, ...args);
  }

  private _registerServerHandlers(): void {
    if (!this._connection) {
      return;
    }

    this._connection.on("SelfIdentify", (msg: SelfIdentifyMessage) => {
      eventBus.emit("mp:self-identify" as any, msg);
    });

    this._connection.on("LobbyUpdate", (msg: LobbyUpdateMessage) => {
      eventBus.emit("mp:lobby-update" as any, msg);
    });

    this._connection.on("RunStarted", (msg: RunStartedMessage) => {
      eventBus.emit("mp:run-started" as any, msg);
    });

    this._connection.on("StartersResolved", (msg: StartersResolvedMessage) => {
      eventBus.emit("mp:starters-resolved" as any, msg);
    });

    this._connection.on("TurnResolved", (msg: TurnResolvedMessage) => {
      eventBus.emit("mp:turn-resolved" as any, msg);
    });

    this._connection.on("DesyncDetected", (msg: DesyncDetectedMessage) => {
      eventBus.emit("mp:desync" as any, msg);
    });

    this._connection.on("PeerDisconnected", (msg: PeerDisconnectedMessage) => {
      eventBus.emit("mp:peer-disconnected" as any, msg);
    });

    this._connection.on("PeerReconnected", (msg: PeerReconnectedMessage) => {
      eventBus.emit("mp:peer-reconnected" as any, msg);
    });

    this._connection.on("SessionEnded", (msg: SessionEndedMessage) => {
      eventBus.emit("mp:session-ended" as any, msg);
    });

    this._connection.on("DecisionResolved", (msg: DecisionResolvedMessage) => {
      eventBus.emit("mp:decision-resolved" as any, msg);
    });
  }

  private _registerConnectionEvents(): void {
    if (!this._connection) {
      return;
    }

    this._connection.onreconnecting(() => {
      this._state = "reconnecting";
      eventBus.emit("mp:reconnecting" as any);
    });

    this._connection.onreconnected(() => {
      this._state = "connected";
      eventBus.emit("mp:reconnected" as any);
    });

    this._connection.onclose(() => {
      this._state = "disconnected";
      eventBus.emit("mp:disconnected" as any);
    });
  }

  private _setupEventForwarding(): void {
    // Listen for submit-command events from MpCommandSync
    eventBus.on("mp:submit-command" as any, (request: SubmitCommandRequest) => {
      this.submitCommand(request).catch((err) => {
        console.error("[MpClient] Failed to submit command:", err);
      });
    });
  }
}
