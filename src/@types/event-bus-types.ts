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
