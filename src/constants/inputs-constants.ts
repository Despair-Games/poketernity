import { SettingGamepad } from "#enums/setting-gamepad";
import { SettingKeyboard } from "#enums/setting-keyboard";
import type { GamepadKeys, KeyboardKeys } from "#types/input-interface-config";

/** Array of Keyboard Keys that should not remapped to any input. */
export const KEYBOARD_KEYS_BLACKLIST: readonly KeyboardKeys[] = Object.freeze([
  "KEY_ENTER",
  "KEY_ESC",
  "KEY_SPACE",
  "KEY_BACKSPACE",
  "KEY_ARROW_UP",
  "KEY_ARROW_DOWN",
  "KEY_ARROW_LEFT",
  "KEY_ARROW_RIGHT",
  "KEY_DEL",
  "KEY_HOME",
]);

/** Array of Keyboard Settings that shouldn't be allowed to be remapped. */
export const KEYBOARD_LOCKED_BINDINGS: readonly SettingKeyboard[] = Object.freeze([
  SettingKeyboard.Button_Submit,
  SettingKeyboard.Button_Menu,
  SettingKeyboard.Button_Action,
  SettingKeyboard.Button_Cancel,
  SettingKeyboard.Button_Up,
  SettingKeyboard.Button_Down,
  SettingKeyboard.Button_Left,
  SettingKeyboard.Button_Right,
  SettingKeyboard.Button_Cycle_Form, // Needed to navigate the settings
  SettingKeyboard.Button_Cycle_Shiny, // Needed to navigate the settings
]);

/** Array of Gamepad Buttons that should not be remapped to any input. */
export const GAMEPAD_BUTTONS_BLACKLIST: readonly GamepadKeys[] = Object.freeze(["LC_N", "LC_S", "LC_W", "LC_E"]);

/** Array of Gamepad Settings that shouldn't be allowed to be remapped. */
export const GAMEPAD_LOCKED_BINDINGS: readonly SettingGamepad[] = Object.freeze([
  SettingGamepad.Button_Up,
  SettingGamepad.Button_Down,
  SettingGamepad.Button_Left,
  SettingGamepad.Button_Right,
]);
