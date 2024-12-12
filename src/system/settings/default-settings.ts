import type { AudioSettings, DisplaySettings, GeneralSettings, Settings } from "#app/@types/Settings";
import { BattleStyle } from "#app/enums/battle-style";
import { CandyUpgradeDisplayMode } from "#app/enums/candy-upgrade-display";
import { CandyUpgradeNotificationMode } from "#app/enums/candy-upgrade-notification-mode";
import { DamageNumbersMode } from "#app/enums/damage-numbers-mode";
import { EaseType } from "#app/enums/ease-type";
import { EggSkipPreference } from "#app/enums/egg-skip-preference";
import { ExpGainsSpeed } from "#app/enums/exp-gains-speed";
import { ExpNotification } from "#app/enums/exp-notification";
import { HpBarSpeed } from "#app/enums/hp-bar-speed";
import { MoneyFormat } from "#app/enums/money-format";
import { MusicPreference } from "#app/enums/music-preference";
import { ShopCursorTarget } from "#app/enums/shop-cursor-target";
import { SpriteSet } from "#app/enums/sprite-set";
import { UiTheme } from "#app/enums/ui-theme";
import { Gender } from "#enums/gender";
import { UiWindowType } from "#enums/ui-window-type";

export const defaultGeneralSettings: GeneralSettings = {
  gameSpeed: 2,
  hpBarSpeed: HpBarSpeed.DEFAULT,
  expGainsSpeed: ExpGainsSpeed.DEFAULT,
  partyExpNotificationMode: ExpNotification.DEFAULT,
  skipSeenDialogues: false,
  eggSkipPreference: EggSkipPreference.NEVER,
  battleStyle: BattleStyle.SWITCH,
  enableRetries: false,
  hideIvScanner: false,
  enableTutorials: import.meta.env.VITE_BYPASS_TUTORIAL === "1",
  enableTouchControls: false,
  enableVibration: false,
};

export const defaultDisplaySettings: DisplaySettings = {
  uiTheme: UiTheme.DEFAULT,
  windowType: UiWindowType.RED_ORANGE,
  moneyFormat: MoneyFormat.NORMAL,
  damageNumbersMode: DamageNumbersMode.OFF,
  enableMoveAnimations: true,
  showStatsOnLevelUp: true,
  candyUpgradeNotificationMode: CandyUpgradeNotificationMode.ON,
  candyUpgradeDisplayMode: CandyUpgradeDisplayMode.ICON,
  enableMoveInfo: true,
  showMovesetFlyout: true,
  showArenaFlyout: true,
  showTimeOfDayWidget: true,
  timeOfDayAnimation: EaseType.NONE,
  spriteSet: SpriteSet.CONSISTENT,
  enableFusionPaletteSwaps: true,
  playerGender: Gender.MALE,
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
  musicPreference: MusicPreference.MIXED,
};

export const defaultSettings: Settings = {
  general: defaultGeneralSettings,
  display: defaultDisplaySettings,
  audio: defaultAudioSettings,

  //TODO: game-pad

  //TODO: Controls (binding)
};
