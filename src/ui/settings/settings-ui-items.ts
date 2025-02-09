import type {
  AudioSettingsKey,
  DisplaySettingsKey,
  GeneralSettingsKey,
  SettingsUiItem,
  SettingUiItemOption,
} from "#app/@types/Settings";
import { GAME_SPEEDS } from "#app/constants";
import { BattleStyle } from "#app/enums/battle-style";
import { DamageNumbersMode } from "#app/enums/damage-numbers-mode";
import { EaseType } from "#app/enums/ease-type";
import { EggSkipPreference } from "#app/enums/egg-skip-preference";
import { ExpGainsSpeed } from "#app/enums/exp-gains-speed";
import { ExpNotification } from "#app/enums/exp-notification";
import { HpBarSpeed } from "#app/enums/hp-bar-speed";
import { MoneyFormat } from "#app/enums/money-format";
import { PlayerGender } from "#app/enums/player-gender";
import { ShopCursorTarget } from "#app/enums/shop-cursor-target";
import { UiTheme } from "#app/enums/ui-theme";
import { supportedLanguages } from "#app/system/settings/supported-languages";
import { isLandscapeMode } from "#app/utils";
import i18next, { t } from "i18next";

//#region Types

type UseOptionInit = Pick<SettingUiItemOption, "requiresConfirmation" | "confirmationMessage">;

//#endregion
//#region Helper Functions

/**
 * Creates an array with "on/off" options.
 * @param onInit Initial settings for "on" option. Default `{}`
 * @param offInit Initial settings for "off" option. Default `{}`
 * @returns On/off options array
 */
function useOnOffOptions(onInit: UseOptionInit = {}, offInit: UseOptionInit = {}): SettingUiItemOption[] {
  return [
    { value: true, label: t("settings:on"), ...onInit },
    { value: false, label: t("settings:off"), ...offInit },
  ];
}

/**
 * Creates an array with "auto/disabled" options.
 * @param autoInit Initial settings for "auto" option. Default `{}`
 * @param disabledInit Initial settings for "disabled" option. Default `{}`
 * @returns Auto/disabled options array
 */
function useAutoDisabledOptions(autoInit: UseOptionInit = {}, disabledInit: UseOptionInit = {}): SettingUiItemOption[] {
  return [
    { value: true, label: t("settings:auto"), ...autoInit },
    { value: false, label: t("settings:disabled"), ...disabledInit },
  ];
}

/**
 * Creates an array with volume options ranging from 0/mute - 100 in 10 steps
 * @returns An array from 0 - 100
 */
function useVolumeOptions(): SettingUiItemOption[] {
  return Array.from({ length: 11 }).map((_, i) => ({
    value: Number((i * 0.1).toFixed(1)),
    label: i > 0 ? `${i * 10}` : t("settings:mute"),
  }));
}

/**
 * Creates an array with game speed options ranging from 1x - 5x (inconsistent steps).
 * @returns An array from 1x - 5x
 */
function useGameSpeedOptions(): SettingUiItemOption[] {
  return GAME_SPEEDS.map((n) => ({ value: n, label: `${n}x` }));
}

//#endregion

/**
 * UI items for general settings
 */
export const generalSettingsUiItems: SettingsUiItem<GeneralSettingsKey>[] = [
  {
    key: "gameSpeed",
    label: t("settings:gameSpeed"),
    options: useGameSpeedOptions(),
    doWrap: true,
  },
  {
    key: "hpBarSpeed",
    label: t("settings:hpBarSpeed"),
    options: [
      { value: HpBarSpeed.DEFAULT, label: t("settings:normal") },
      { value: HpBarSpeed.FAST, label: t("settings:fast") },
      { value: HpBarSpeed.FASTER, label: t("settings:faster") },
      { value: HpBarSpeed.SKIP, label: t("settings:skip") },
    ],
    doWrap: true,
  },
  {
    key: "expGainsSpeed",
    label: t("settings:expGainsSpeed"),
    options: [
      { value: ExpGainsSpeed.DEFAULT, label: t("settings:normal") },
      { value: ExpGainsSpeed.FAST, label: t("settings:fast") },
      { value: ExpGainsSpeed.FASTER, label: t("settings:faster") },
      { value: ExpGainsSpeed.SKIP, label: t("settings:skip") },
    ],
    doWrap: true,
  },
  {
    key: "partyExpNotificationMode",
    label: t("settings:expPartyDisplay"),
    options: [
      { value: ExpNotification.DEFAULT, label: t("settings:normal") },
      { value: ExpNotification.ONLY_LEVEL_UP, label: t("settings:levelUpNotifications") },
      { value: ExpNotification.SKIP, label: t("settings:skip") },
    ],
    doWrap: true,
  },
  {
    key: "skipSeenDialogues",
    label: t("settings:skipSeenDialogues"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "eggSkipPreference",
    label: t("settings:eggSkip"),
    options: [
      { value: EggSkipPreference.NEVER, label: t("settings:never") },
      { value: EggSkipPreference.ASK, label: t("settings:ask") },
      { value: EggSkipPreference.ALWAYS, label: t("settings:always") },
    ],
    doWrap: true,
  },
  {
    key: "battleStyle",
    label: t("settings:battleStyle"),
    options: [
      { value: BattleStyle.SWITCH, label: t("settings:switch") },
      { value: BattleStyle.SET, label: t("settings:set") },
    ],
    doWrap: true,
  },
  {
    key: "enableRetries",
    label: t("settings:enableRetries"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "hideIvScanner",
    label: t("settings:hideIvs"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "enableTutorials",
    label: t("settings:tutorials"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "enableVibration",
    label: t("settings:vibrations"),
    options: useAutoDisabledOptions(),
    doWrap: true,
  },
  {
    key: "enableTouchControls",
    label: t("settings:touchControls"),
    options: useAutoDisabledOptions(
      {},
      { requiresConfirmation: true, confirmationMessage: t("settings:confirmDisableTouch") },
    ),
    touchscreenOnly: true,
  },
  {
    key: "moveTouchControls",
    label: t("settings:moveTouchControls"),
    options: [
      {
        value: 0,
        label: isLandscapeMode() ? t("settings:landscape") : t("settings:portrait"),
      },
      {
        value: 1,
        label: t("settings:configure"),
      },
    ],
    touchscreenOnly: true,
  },
];

/**
 * UI items for display settings
 */
export const displaySettingUiItems: SettingsUiItem<DisplaySettingsKey>[] = [
  {
    key: "language",
    label: t("settings:language"),
    options: [
      {
        label: supportedLanguages.find((l) => l.key === i18next.resolvedLanguage)?.label ?? "English",
        value: 0,
      },
      {
        label: t("settings:change"),
        value: 1,
      },
    ],
    requiresReload: true,
  },
  {
    key: "uiTheme",
    label: t("settings:uiTheme"),
    options: [
      { value: UiTheme.DEFAULT, label: t("settings:default") },
      { value: UiTheme.LEGACY, label: t("settings:legacy") },
    ],
    requiresReload: true,
  },
  {
    key: "uiWindowType",
    label: t("settings:windowType"),
    options: Array.from({ length: 5 }).map((_, i) => ({ value: i + 1, label: `${i + 1}` })),
    doWrap: true,
  },
  {
    key: "moneyFormat",
    label: t("settings:moneyFormat"),
    options: [
      { value: MoneyFormat.NORMAL, label: t("settings:normal") },
      { value: MoneyFormat.ABBREVIATED, label: t("settings:abbreviated") },
    ],
    doWrap: true,
  },
  {
    key: "damageNumbersMode",
    label: t("settings:damageNumbers"),
    options: [
      { value: DamageNumbersMode.OFF, label: t("settings:off") },
      { value: DamageNumbersMode.SIMPLE, label: t("settings:simple") },
      { value: DamageNumbersMode.FANCY, label: t("settings:fancy") },
    ],
    doWrap: true,
  },
  {
    key: "enableMoveAnimations",
    label: t("settings:moveAnimations"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "showStatsOnLevelUp",
    label: t("settings:showStatsOnLevelUp"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "enableMoveInfo",
    label: t("settings:moveInfo"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "showMovesetFlyout",
    label: t("settings:showMovesetFlyout"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "showArenaFlyout",
    label: t("settings:showArenaFlyout"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "showTimeOfDayWidget",
    label: t("settings:showTimeOfDayWidget"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "timeOfDayAnimation",
    label: t("settings:timeOfDayAnimation"),
    options: [
      { value: EaseType.BOUNCE, label: t("settings:bounce") },
      { value: EaseType.BACK, label: t("settings:timeOfDay_back") },
    ],
    doWrap: true,
  },
  {
    key: "enableFusionPaletteSwaps",
    label: t("settings:fusionPaletteSwaps"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "playerGender",
    label: t("settings:playerGender"),
    options: [
      { value: PlayerGender.MALE, label: t("settings:boy") },
      { value: PlayerGender.FEMALE, label: t("settings:girl") },
    ],
    doWrap: true,
  },
  {
    key: "enableTypeHints",
    label: t("settings:typeHints"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "showBgmBar",
    label: t("settings:showBgmBar"),
    options: useOnOffOptions(),
    doWrap: true,
  },
  {
    key: "shopCursorTarget",
    label: t("settings:shopCursorTarget"),
    options: [
      { value: ShopCursorTarget.REWARDS, label: t("settings:rewards") },
      { value: ShopCursorTarget.SHOP, label: t("settings:shop") },
      { value: ShopCursorTarget.REROLL, label: t("settings:reroll") },
      { value: ShopCursorTarget.CHECK_TEAM, label: t("settings:checkTeam") },
    ],
    doWrap: true,
  },
  {
    key: "shopOverlayOpacity",
    label: t("settings:shopOverlayOpacity"),
    options: Array.from({ length: 9 }).map((_, i) => ({
      value: Number(((i + 1) * 0.1).toFixed(1)),
      label: `${(i + 1) * 10}`,
    })),
    doWrap: true,
  },
];

/**
 * UI items for audio settings
 */
export const audioSettingsUiItems: SettingsUiItem<AudioSettingsKey>[] = [
  {
    key: "masterVolume",
    label: t("settings:masterVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "bgmVolume",
    label: t("settings:bgmVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "fieldVolume",
    label: t("settings:fieldVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "soundEffectsVolume",
    label: t("settings:seVolume"),
    options: useVolumeOptions(),
  },
  {
    key: "uiVolume",
    label: t("settings:uiVolume"),
    options: useVolumeOptions(),
  },
];
