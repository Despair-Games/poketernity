import type { BattleStyle } from "#enums/battle-style";
import type { CandyUpgradeDisplayMode } from "#enums/candy-upgrade-display";
import type { CandyUpgradeNotificationMode } from "#enums/candy-upgrade-notification-mode";
import type { DamageNumbersMode } from "#enums/damage-numbers-mode";
import type { EaseType } from "#enums/ease-type";
import type { EggSkipPreference } from "#enums/egg-skip-preference";
import type { ExpGainsSpeed } from "#enums/exp-gains-speed";
import type { ExpNotification } from "#enums/exp-notification";
import type { HpBarSpeed } from "#enums/hp-bar-speed";
import type { MoneyFormat } from "#enums/money-format";
import type { MusicPreference } from "#enums/music-preference";
import type { ShopCursorTarget } from "#enums/shop-cursor-target";
import type { Gender } from "#enums/gender";
import type { UiTheme } from "#enums/ui-theme";
import type { UiWindowType } from "#enums/ui-window-type";

export interface Settings {
  general: GeneralSettings;
  audio: AudioSettings;
  display: DisplaySettings;
  gamepad: GamepadSettings;
}

export interface GeneralSettings {
  gameSpeed: number;
  hpBarSpeed: HpBarSpeed;
  expGainsSpeed: ExpGainsSpeed;
  partyExpNotificationMode: ExpNotification;
  skipSeenDialogues: boolean;
  eggSkipPreference: EggSkipPreference;
  battleStyle: BattleStyle;
  enableRetries: boolean;
  hideIvScanner: boolean;
  enableTutorials: boolean;
  enableTouchControls: boolean;
  enableVibration: boolean;
}

export interface DisplaySettings {
  uiTheme: UiTheme;
  uiWindowType: UiWindowType;
  moneyFormat: MoneyFormat;
  damageNumbersMode: DamageNumbersMode;
  enableMoveAnimations: boolean;
  showStatsOnLevelUp: boolean;
  candyUpgradeNotificationMode: CandyUpgradeNotificationMode;
  candyUpgradeDisplayMode: CandyUpgradeDisplayMode;
  enableMoveInfo: boolean;
  showMovesetFlyout: boolean;
  showArenaFlyout: boolean;
  showTimeOfDayWidget: boolean;
  timeOfDayAnimation: EaseType;
  enableFusionPaletteSwaps: boolean;
  playerGender: Gender;
  enableTypeHints: boolean;
  showBgmBar: boolean;
  shopCursorTarget: ShopCursorTarget;
  shopOverlayOpacity: number;
  language?: string;
}

export interface AudioSettings {
  masterVolume: number;
  bgmVolume: number;
  fieldVolume: number;
  soundEffectsVolume: number;
  uiVolume: number;
  musicPreference: MusicPreference;
}

export interface GamepadSettings {
  activeIndex: number;
  enabled: boolean;
}

export type SettingUiItemOption = {
  value: number | string | boolean;
  label: string;
  needConfirmation?: boolean;
  confirmationMessage?: string;
};

export interface SettingsUiItem<K = string> {
  key: K;
  label: string;
  options: SettingUiItemOption[];
  /** Indicates if a settings change requires a reload */
  requiresReload?: boolean;
  /** Whether the setting is only available on devices supporting touchscreen. */
  touchscreenOnly?: boolean;
}

export type SettingsCategory = keyof Settings;

/** All keys for all settings categories */
export type AnySettingKey = GeneralSettingsKey | DisplaySettingsKey | AudioSettingsKey | GamepadSettingsKey;

/** All keys for the general settings + `"moveTouchControls"`. */
export type GeneralSettingsKey = keyof GeneralSettings | "moveTouchControls";

/** All keys for the display settings + `"language"`. */
export type DisplaySettingsKey = keyof DisplaySettings | "language";

/** All keys for the audio settings/ */
export type AudioSettingsKey = keyof AudioSettings;

/** All keys for the gamepad settings. */
export type GamepadSettingsKey = keyof GamepadSettings;

export interface SettingsUpdateEventArgs {
  category: SettingsCategory;
  key: AnySettingKey;
  value: string | number | boolean;
}

export type SettingsEvent = "settings/updated" | "settings/update/failed" | "settings/saved";
