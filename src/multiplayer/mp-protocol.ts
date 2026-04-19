// --- Client → Server messages ---
export interface CreateLobbyRequest {
  mode: "coop";
  clientBuildHash?: string;
}

export interface JoinLobbyRequest {
  inviteCode: string;
}

export interface SetReadyRequest {
  ready: boolean;
}

export interface SubmitCommandRequest {
  turnIndex: number;
  waveIndex: number;
  commandJson: string;
  stateHash: string;
}

// --- Server → Client messages ---
export interface LobbyUpdateMessage {
  sessionId: string;
  inviteCode: string;
  participants: LobbyParticipantDto[];
  status: "waiting" | "ready" | "starting";
}

export interface LobbyParticipantDto {
  userId: string;
  username: string;
  isHost: boolean;
  isReady: boolean;
}

export interface RunStartedMessage {
  sessionId: string;
  seed: string;
  peers: PeerInfo[];
  clientBuildHash: string;
}

export interface PeerInfo {
  userId: string;
  username: string;
  isHost: boolean;
}

export interface TurnResolvedMessage {
  turnIndex: number;
  waveIndex: number;
  peerCommands: PeerCommandData[];
}

export interface PeerCommandData {
  userId: string;
  commandJson: string;
}

export interface DesyncDetectedMessage {
  turnIndex: number;
  waveIndex: number;
  expectedHash: string;
  peerHashes: Record<string, string>;
}

export interface SelfIdentifyMessage {
  userId: string;
  username: string;
}

export interface PeerDisconnectedMessage {
  peerId: string;
  username: string;
  graceSeconds: number;
}

export interface PeerReconnectedMessage {
  peerId: string;
  username: string;
}

export interface SessionEndedMessage {
  reason: "completed" | "abandoned" | "desync" | "converted_to_solo";
  convertedToSoloByUserId?: string;
}

// --- REST DTOs ---
export interface CreateLobbyResponse {
  sessionId: string;
  inviteCode: string;
}

export interface LobbyInfoResponse {
  sessionId: string;
  mode: string;
  hostUsername: string;
  participants: LobbyParticipantDto[];
  status: string;
}

export interface SessionSummaryResponse {
  sessionId: string;
  mode: string;
  status: string;
  currentWave: number;
  createdAt: string;
  endedAt?: string;
  endReason?: string;
  participants: ParticipantSummary[];
}

export interface ParticipantSummary {
  userId: string;
  username: string;
  role: string;
  isHost: boolean;
  finalWave?: number;
  outcome?: string;
}
