import type {
  AudioSettings,
  DisplaySettings,
  GamepadSettings,
  GeneralSettings,
  UserFacingSettings,
} from "#app/@types/Settings";
import { BattleStyle } from "#enums/battle-style";
import { DamageNumbersMode } from "#enums/damage-numbers-mode";
import { EaseType } from "#enums/ease-type";
import { EggSkipPreference } from "#enums/egg-skip-preference";
import { ExpGainsSpeed } from "#enums/exp-gains-speed";
import { ExpNotification } from "#enums/exp-notification";
import { HpBarSpeed } from "#enums/hp-bar-speed";
import { MoneyFormat } from "#enums/money-format";
import { ShopCursorTarget } from "#enums/shop-cursor-target";
import { UiTheme } from "#enums/ui-theme";
import { PlayerGender } from "#enums/player-gender";
import { UiWindowType } from "#enums/ui-window-type";

export const defaultGeneralSettings: GeneralSettings = {
  gameSpeed: 2,
  hpBarSpeed: HpBarSpeed.DEFAULT,
  expGainsSpeed: ExpGainsSpeed.DEFAULT,
  partyExpNotificationMode: ExpNotification.DEFAULT,
  skipSeenDialogues: false,
  eggSkipPreference: EggSkipPreference.ASK,
  battleStyle: BattleStyle.SWITCH,
  enableRetries: false,
  hideIvScanner: false,
  enableTutorials: import.meta.env.VITE_BYPASS_TUTORIAL !== "1",
  enableTouchControls: true, // auto
  enableVibration: false,
};

export const defaultDisplaySettings: DisplaySettings = {
  uiTheme: UiTheme.DEFAULT,
  uiWindowType: UiWindowType.RED_ORANGE,
  moneyFormat: MoneyFormat.NORMAL,
  damageNumbersMode: DamageNumbersMode.OFF,
  enableMoveAnimations: true,
  showStatsOnLevelUp: true,
  enableMoveInfo: true,
  showMovesetFlyout: true,
  showArenaFlyout: true,
  showTimeOfDayWidget: true,
  timeOfDayAnimation: EaseType.BOUNCE,
  enableFusionPaletteSwaps: true,
  playerGender: PlayerGender.UNSET,
  enableTypeHints: false,
  showBgmBar: true,
  shopCursorTarget: ShopCursorTarget.REWARDS,
  shopOverlayOpacity: 0.8,
};

export const defaultAudioSettings: AudioSettings = {
  masterVolume: 0.5,
  bgmVolume: 1,
  fieldVolume: 1,
  soundEffectsVolume: 1,
  uiVolume: 1,
};

export const defaultGamepadSettings: GamepadSettings = {
  activeIndex: 0,
  enabled: true,
};

export const defaultSettings: UserFacingSettings = {
  general: defaultGeneralSettings,
  display: defaultDisplaySettings,
  audio: defaultAudioSettings,
  gamepad: defaultGamepadSettings,
};
