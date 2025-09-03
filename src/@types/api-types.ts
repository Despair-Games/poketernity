import type { SessionSaveData } from "#types/session-data";
import type { SystemSaveData } from "#types/system-data";

export interface TitleStatsResponse {
  playerCount: number;
  battleCount: number;
}

// #region Account API

export interface UserInfo {
  username: string;
  lastSessionSlot: number;
  discordId: string;
  googleId: string;
  hasAdminRole: boolean;
}

export interface AccountInfoResponse extends UserInfo {}

export interface AccountLoginRequest {
  username: string;
  password: string;
}

export interface AccountLoginResponse {
  token: string;
}

export interface AccountRegisterRequest {
  username: string;
  password: string;
}

// #endregion
// #region Admin API

export interface LinkAccountToDiscordIdRequest {
  username: string;
  discordId: string;
}

export interface UnlinkAccountFromDiscordIdRequest {
  username: string;
  discordId: string;
}

export interface LinkAccountToGoogledIdRequest {
  username: string;
  googleId: string;
}

export interface UnlinkAccountFromGoogledIdRequest {
  username: string;
  googleId: string;
}

export interface SearchAccountRequest {
  username: string;
}

export interface SearchAccountResponse {
  username: string;
  discordId: string;
  googleId: string;
  lastLoggedIn: string;
  registered: string;
}

// #endregion
// #region Save Data API

export interface UpdateAllSavedataRequest {
  system: SystemSaveData;
  session: SessionSaveData;
  sessionSlotId: number;
  clientSessionId: string;
}

// #endregion
// #region System Save API

export interface GetSystemSavedataRequest {
  clientSessionId: string;
}

export class UpdateSystemSavedataRequest {
  clientSessionId: string;
  trainerId?: number;
  secretId?: number;
}

export interface VerifySystemSavedataRequest {
  clientSessionId: string;
}

export interface VerifySystemSavedataResponse {
  valid: boolean;
  systemData: SystemSaveData;
}

// #endregion
// #region Session Save API

export class UpdateSessionSavedataRequest {
  slot: number;
  trainerId: number;
  secretId: number;
  clientSessionId: string;
}

/** This is **NOT** similar to {@linkcode ClearSessionSavedataRequest}  */
export interface NewClearSessionSavedataRequest {
  slot: number;
  isVictory: boolean;
  clientSessionId: string;
}

export interface GetSessionSavedataRequest {
  slot: number;
  clientSessionId: string;
}

export interface DeleteSessionSavedataRequest {
  slot: number;
  clientSessionId: string;
}

/** This is **NOT** similar to {@linkcode NewClearSessionSavedataRequest} */
export interface ClearSessionSavedataRequest {
  slot: number;
  trainerId: number;
  clientSessionId: string;
}

/** API response for path: `/savedata/session/clear` */
export interface ClearSessionSavedataResponse {
  /** Contains the error message if any occured */
  error?: string;
  /** Is `true` if the request was successfully processed */
  success?: boolean;
}

// #endregion
