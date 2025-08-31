import { BattleStyle } from "#enums/battle-style";
import { DamageNumbersMode } from "#enums/damage-numbers-mode";
import { EaseType } from "#enums/ease-type";
import { EggSkipPreference } from "#enums/egg-skip-preference";
import { ExpGainSpeed } from "#enums/exp-gain-speed";
import { ExpNotification } from "#enums/exp-notification";
import { HpBarSpeed } from "#enums/hp-bar-speed";
import { KeyboardLayout } from "#enums/keyboard-layout";
import { MoneyFormat } from "#enums/money-format";
import { PlayerGender } from "#enums/player-gender";
import { ShopCursorTarget } from "#enums/shop-cursor-target";
import { UiTheme } from "#enums/ui-theme";
import { UiWindowStyle } from "#enums/ui-window-style";
import type {
  AudioSettings,
  DisplaySettings,
  GamepadSettings,
  GeneralSettings,
  KeyboardSettings,
  UserFacingSettings,
} from "#types/settings";

const defaultGeneralSettings: GeneralSettings = {
  gameSpeed: 2,
  hpBarSpeed: HpBarSpeed.DEFAULT,
  expGainSpeed: ExpGainSpeed.DEFAULT,
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

const defaultDisplaySettings: DisplaySettings = {
  uiTheme: UiTheme.DARK,
  uiWindowStyle: UiWindowStyle.RED_ORANGE,
  moneyFormat: MoneyFormat.NORMAL,
  damageNumbersMode: DamageNumbersMode.OFF,
  enableMoveAnimations: true,
  showStatsOnLevelUp: true,
  enableMoveInfo: true,
  showMovesetFlyout: true,
  showArenaFlyout: true,
  showTimeOfDayWidget: true,
  timeOfDayAnimation: EaseType.BOUNCE,
  playerGender: PlayerGender.UNSET,
  enableTypeHints: false,
  showBgmBar: true,
  shopCursorTarget: ShopCursorTarget.REWARDS,
  shopOverlayOpacity: 0.8,
};

const defaultAudioSettings: AudioSettings = {
  masterVolume: 0.5,
  bgmVolume: 1,
  fieldVolume: 1,
  soundEffectsVolume: 1,
  uiVolume: 1,
};

const defaultGamepadSettings: GamepadSettings = {
  activeIndex: 0,
  enabled: true,
};

const defaultKeyboardSettings: KeyboardSettings = {
  layout: KeyboardLayout.QWERTY,
};

export const defaultSettings: UserFacingSettings = {
  general: defaultGeneralSettings,
  display: defaultDisplaySettings,
  audio: defaultAudioSettings,
  gamepad: defaultGamepadSettings,
  keyboard: defaultKeyboardSettings,
};
