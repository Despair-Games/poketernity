import type { BattleStyle } from "#app/enums/battle-style";
import type { CandyUpgradeDisplayMode } from "#app/enums/candy-upgrade-display";
import type { CandyUpgradeNotificationMode } from "#app/enums/candy-upgrade-notification-mode";
import type { DamageNumbersMode } from "#app/enums/damage-numbers-mode";
import type { EaseType } from "#app/enums/ease-type";
import type { EggSkipPreference } from "#app/enums/egg-skip-preference";
import type { ExpGainsSpeed } from "#app/enums/exp-gains-speed";
import type { ExpNotification } from "#app/enums/exp-notification";
import type { HpBarSpeed } from "#app/enums/hp-bar-speed";
import type { MoneyFormat } from "#app/enums/money-format";
import type { MusicPreference } from "#app/enums/music-preference";
import type { ShopCursorTarget } from "#app/enums/shop-cursor-target";
import type { SpriteSet } from "#app/enums/sprite-set";
import type { UiTheme } from "#app/enums/ui-theme";
import type { Gender } from "#enums/gender";
import type { UiWindowType } from "#enums/ui-window-type";

export interface Settings {
  general: GeneralSettings;
  audio: AudioSettings;
  display: DisplaySettings;
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
  spriteSet: SpriteSet;
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
  /** Wheter the setting is only available on devices supporting touchscreen. */
  touchscreenOnly?: boolean;
}

export type SettingsCategory = keyof Settings;

/** All keys for the general settings + `"moveTouchControls"` */
export type GeneralSettingsKey = keyof GeneralSettings | "moveTouchControls";

/** All keys for the display settings + `"language"` */
export type DisplaySettingsKey = keyof DisplaySettings | "language";

export type AudioSettingsKey = keyof AudioSettings;

export type AnySettingKey = GeneralSettingsKey | DisplaySettingsKey | AudioSettingsKey;

export interface SettingsUpdateEventArgs {
  category: SettingsCategory;
  key: AnySettingKey;
  value: string | number | boolean;
}

export type SettingsEvent = "settings/updated" | "settings/update/failed" | "settings/saved";
