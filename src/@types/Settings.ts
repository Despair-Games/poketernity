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
  /** Controlled by i18n. */
  language: string;
  uiTheme: UiTheme;
  windowType: number;
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
  // playerGender: Gender;
  enableTypeHints: boolean;
  showBgmBar: boolean;
  shopCursorTarget: ShopCursorTarget;
  shopOverlayOpacity: number;
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
  /** @deprecated Use events instead */
  requireReload?: boolean;
  /** @deprecated */
  activatable?: boolean;
  /** @deprecated Hidden items don't exist anymore. */
  isHidden?: () => boolean;
}

export type GeneralSettingsKey = keyof GeneralSettings;

export type DisplaySettingsKey = keyof DisplaySettings;

export type AudioSettingsKey = keyof AudioSettings;

export type AnySettingKey = GeneralSettingsKey | DisplaySettingsKey | AudioSettingsKey;

export interface SettingsUpdateEventArgs {
  category: keyof Settings;
  key: AnySettingKey;
  value: string | number | boolean;
}
