/**
 * Keys for input related events.
 *  - `keyboard/init`, for when a keyboard is first detected.
 *  - `gamepad/init`, for when a gamepad is being used for the first time.
 */
export type InputsEvent = "keyboard/init" | "gamepad/init";

export type TouchControlsEvent =
  | "touchControls/move/start"
  | "touchControls/move/end"
  | "touchControls/move/save"
  | "touchControls/move/cancel"
  | "touchControls/move/reset";

export type SettingsEvent = "settings/updated" | "settings/update/failed" | "settings/saved";

/**
 * Multiplayer events emitted by the MP client and consumed by game systems.
 */
export type MultiplayerEvent =
  | "mp:connected"
  | "mp:disconnected"
  | "mp:connection-error"
  | "mp:reconnecting"
  | "mp:reconnected"
  | "mp:lobby-update"
  | "mp:run-started"
  | "mp:turn-resolved"
  | "mp:desync"
  | "mp:peer-disconnected"
  | "mp:peer-reconnected"
  | "mp:session-ended"
  | "mp:submit-command"
  | "mp:peer-joined"
  | "mp:peer-left"
  | "mp:turn-sync";
