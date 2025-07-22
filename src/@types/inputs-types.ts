import type { Button } from "#enums/button";
import type { SettingGamepad } from "#enums/setting-gamepad";
import type { SettingKeyboard } from "#enums/setting-keyboard";

/** All keyboard keys that the game recognizes or allows to map to an action. */
// prettier-ignore
export type KeyboardKeys = "KEY_A" | "KEY_B" | "KEY_C" | "KEY_D" | "KEY_E" | "KEY_F" | "KEY_G" | "KEY_H"
  | "KEY_I" | "KEY_J" | "KEY_K" | "KEY_L" | "KEY_M" | "KEY_N" | "KEY_O" | "KEY_P" | "KEY_Q" | "KEY_R"
  | "KEY_S" | "KEY_T" | "KEY_U" | "KEY_V" | "KEY_W" | "KEY_X" | "KEY_Y" | "KEY_Z"
  | "KEY_0" | "KEY_1" | "KEY_2" | "KEY_3" | "KEY_4" | "KEY_5" | "KEY_6" | "KEY_7" | "KEY_8" | "KEY_9"
  | "KEY_CTRL" | "KEY_DEL" | "KEY_END" | "KEY_ENTER" | "KEY_ESC" | "KEY_F1" | "KEY_F2" | "KEY_F3"
  | "KEY_F4" | "KEY_F5" | "KEY_F6" | "KEY_F7" | "KEY_F8" | "KEY_F9" | "KEY_F10" | "KEY_F11" | "KEY_F12"
  | "KEY_HOME" | "KEY_INSERT" | "KEY_PAGE_DOWN" | "KEY_PAGE_UP" | "KEY_PLUS" | "KEY_MINUS" | "KEY_QUOTATION"
  | "KEY_SHIFT" | "KEY_SPACE" | "KEY_TAB" | "KEY_TILDE"
  | "KEY_ARROW_UP" | "KEY_ARROW_DOWN" | "KEY_ARROW_LEFT" | "KEY_ARROW_RIGHT"
  | "KEY_LEFT_BRACKET" | "KEY_RIGHT_BRACKET" | "KEY_SEMICOLON" | "KEY_BACKSPACE" | "KEY_ALT";

// prettier-ignore
export type BasicGamepadKeys = "RC_S" | "RC_E" | "RC_W" | "RC_N" | "START" | "SELECT"
  | "LB" | "RB" | "LC_N" | "LC_S" | "LC_W" | "LC_E";
export type ModernGamepadKeys = BasicGamepadKeys | "LT" | "RT" | "LS" | "RS";
export type DualshockKeys = ModernGamepadKeys | "TOUCH";
export type ProControllerKeys = ModernGamepadKeys | "MENU";

export type GamepadKeys = BasicGamepadKeys | ModernGamepadKeys | DualshockKeys | ProControllerKeys;

export type InputKeys = GamepadKeys | KeyboardKeys;

export type InputSettings = SettingGamepad | SettingKeyboard;

export type InputMappings<K extends InputKeys = InputKeys, S extends InputSettings = InputSettings> = Record<K, S | -1>;

/**
 * Interface used to define the configuration of specific types of keyboard or gamepads.
 * @typeParam K - Represent the usable buttons for this device type.
 * @typeParam S - Represent the mapping settings for this device type.
 */
export interface InputInterfaceConfig<K extends InputKeys = InputKeys, S extends InputSettings = InputSettings> {
  /** Unique ID for this type of device. */
  padID: string;
  /** Device type. Should have a matching image file for buttons in `public/images/inputs`. */
  padType: string;
  /** Mapping each key to a Phaser keycode. */
  deviceMapping: Record<K, number>;
  /** Mapping of each key to an icon file. */
  icons: Record<K, string>;
  /** Mapping of each Setting for this input interface to a button. */
  settings: Partial<Record<S, Button>>;
  /** Default mappings of each key to a setting. -1 means no mapping. */
  default: InputMappings<K, S>;
  /** Keys of binding settings that cannot be changed. */
  settingsBlacklist?: S[];
  /**
   * Keys of reserved buttons which cannot be (re)mapped.
   * Will be filled automatically with the keys mapped by default to the settingsBlacklist.
   */
  keysBlacklist?: K[];
  /** Custom remappings. -1 means no mapping. */
  custom?: InputMappings<K, S>;
}

export interface KeyboardInterfaceConfig extends InputInterfaceConfig<KeyboardKeys, SettingKeyboard> {}
export interface GamepadInterfaceConfig<T extends GamepadKeys = GamepadKeys>
  extends InputInterfaceConfig<T, SettingGamepad> {}
