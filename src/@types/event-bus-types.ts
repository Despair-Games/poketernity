export type LanguageEvent = "language/change";

/**
 * Keys for input related event.
 *  - `keyboard/init`, for when a keyboard is first detected.
 *  - `gamepad/init`, for when a specific gamepad is first used in a session.
 */
export type InputsEvent = "keyboard/init" | "gamepad/init";

export type TouchControlsEvent =
  | "touchControls/move/start"
  | "touchControls/move/end"
  | "touchControls/move/save"
  | "touchControls/move/cancel"
  | "touchControls/move/reset";

export type SettingsEvent = "settings/updated" | "settings/update/failed" | "settings/saved";
