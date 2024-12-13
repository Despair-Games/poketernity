import type {
  AudioSettingsKey,
  DisplaySettingsKey,
  GeneralSettingsKey,
  SettingsUiItem,
  SettingUiItemOption,
} from "#app/@types/Settings";
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
import i18next, { t } from "i18next";
import { supportedLanguages } from "./supported-languages";

//#region Helper Functions

function useBoolOptions(
  trueI18nKey: string = "settings:on",
  falseI18nKey: string = "settings:off",
): SettingUiItemOption[] {
  return [
    { value: false, label: t(falseI18nKey) },
    { value: true, label: t(trueI18nKey) },
  ];
}

function useVolumeOptions(): SettingUiItemOption[] {
  return Array.from({ length: 11 }).map((_, i) => ({
    value: Number((i * 0.1).toFixed(1)),
    label: i > 0 ? `${i * 10}` : t("settings:mute"),
  }));
}

//#endregion

//#region Constants

export const gameSpeedOptions: number[] = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5];

//#endregion

/**
 * UI items for general settings
 */
export const generalSettingsUiItems: SettingsUiItem<GeneralSettingsKey>[] = [
  {
    key: "gameSpeed",
    label: t("settings:gameSpeed"),
    options: gameSpeedOptions.map((n) => ({ value: n, label: `${n}x` })),
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
  },
  {
    key: "partyExpNotificationMode",
    label: t("settings:expPartyDisplay"),
    options: [
      { value: ExpNotification.DEFAULT, label: t("settings:normal") },
      { value: ExpNotification.ONLY_LEVEL_UP, label: t("settings:levelUpNotifications") },
      { value: ExpNotification.SKIP, label: t("settings:skip") },
    ],
  },
  {
    key: "skipSeenDialogues",
    label: t("settings:skipSeenDialogues"),
    options: useBoolOptions(),
  },
  {
    key: "eggSkipPreference",
    label: t("settings:eggSkip"),
    options: [
      { value: EggSkipPreference.NEVER, label: t("settings:never") },
      { value: EggSkipPreference.ASK, label: t("settings:ask") },
      { value: EggSkipPreference.ALWAYS, label: t("settings:always") },
    ],
  },
  {
    key: "battleStyle",
    label: t("settings:battleStyle"),
    options: [
      { value: BattleStyle.SWITCH, label: t("settings:switch") },
      { value: BattleStyle.SET, label: t("settings:set") },
    ],
  },
  {
    key: "enableRetries",
    label: t("settings:enableRetries"),
    options: useBoolOptions(),
  },
  {
    key: "hideIvScanner",
    label: t("settings:hideIvs"),
    options: useBoolOptions(),
  },
  {
    key: "enableTutorials",
    label: t("settings:tutorials"),
    options: useBoolOptions(),
  },
  {
    key: "enableTouchControls",
    label: t("settings:touchControls"),
    options: useBoolOptions("settings:auto", "settings:disabled"),
    touchscreenOnly: true,
  },
  {
    key: "moveTouchControls",
    label: i18next.t("settings:moveTouchControls"),
    options: [
      {
        value: "Configure",
        label: i18next.t("settings:change"),
      },
    ],
    touchscreenOnly: true,
  },
  {
    key: "enableVibration",
    label: t("settings:vibrations"),
    options: useBoolOptions("settings:auto", "settings:disabled"),
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

    // TODO: select through dialog menu
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
    key: "windowType",
    label: t("settings:windowType"),
    options: Array.from({ length: 5 }).map((_, i) => ({ value: i + 1, label: `${i + 1}` })),
  },
  {
    key: "moneyFormat",
    label: t("settings:moneyFormat"),
    options: [
      { value: MoneyFormat.NORMAL, label: t("settings:normal") },
      { value: MoneyFormat.ABBREVIATED, label: t("settings:abbreviated") },
    ],
  },
  {
    key: "damageNumbersMode",
    label: t("settings:damageNumbers"),
    options: [
      { value: DamageNumbersMode.OFF, label: t("settings:off") },
      { value: DamageNumbersMode.SIMPLE, label: t("settings:simple") },
      { value: DamageNumbersMode.FANCY, label: t("settings:fancy") },
    ],
  },
  {
    key: "enableMoveAnimations",
    label: t("settings:moveAnimations"),
    options: useBoolOptions(),
  },
  {
    key: "showStatsOnLevelUp",
    label: t("settings:showStatsOnLevelUp"),
    options: useBoolOptions(),
  },
  {
    key: "candyUpgradeNotificationMode",
    label: t("settings:candyUpgradeNotification"),
    options: [
      { value: CandyUpgradeNotificationMode.OFF, label: t("settings:off") },
      { value: CandyUpgradeNotificationMode.PASSIVES_ONLY, label: t("settings:passivesOnly") },
      { value: CandyUpgradeNotificationMode.ON, label: t("settings:on") },
    ],
  },
  {
    key: "candyUpgradeDisplayMode",
    label: t("settings:candyUpgradeDisplay"),
    options: [
      { value: CandyUpgradeDisplayMode.ICON, label: t("settings:icon") },
      { value: CandyUpgradeDisplayMode.ANIMATION, label: t("settings:animation") },
    ],
    requiresReload: true,
  },
  {
    key: "enableMoveInfo",
    label: t("settings:moveInfo"),
    options: useBoolOptions(),
  },
  {
    key: "showMovesetFlyout",
    label: t("settings:showMovesetFlyout"),
    options: useBoolOptions(),
  },
  {
    key: "showArenaFlyout",
    label: t("settings:showArenaFlyout"),
    options: useBoolOptions(),
  },
  {
    key: "showTimeOfDayWidget",
    label: t("settings:showTimeOfDayWidget"),
    options: useBoolOptions(),
  },
  {
    key: "timeOfDayAnimation",
    label: t("settings:timeOfDayAnimation"),
    options: [
      { value: EaseType.BOUNCE, label: t("settings:bounce") },
      { value: EaseType.BACK, label: t("settings:timeOfDay_back") },
    ],
  },
  {
    key: "spriteSet",
    label: t("settings:spriteSet"),
    options: [
      { value: SpriteSet.CONSISTENT, label: t("settings:consistent") },
      { value: SpriteSet.MIXED, label: t("settings:mixedAnimated") },
    ],
    requiresReload: true,
  },
  {
    key: "enableFusionPaletteSwaps",
    label: t("settings:fusionPaletteSwaps"),
    options: useBoolOptions(),
  },
  // {
  //   key: "playerGender",
  //   label: t("settings:playerGender"),
  //   options: [
  //     { value: PlayerGender.MALE, label: t("settings:boy") },
  //     { value: PlayerGender.FEMALE, label: t("settings:girl") },
  //   ],
  // },
  {
    key: "enableTypeHints",
    label: t("settings:typeHints"),
    options: useBoolOptions(),
  },
  {
    key: "showBgmBar",
    label: t("settings:showBgmBar"),
    options: useBoolOptions(),
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
  },
  {
    key: "shopOverlayOpacity",
    label: t("settings:shopOverlayOpacity"),
    options: Array.from({ length: 9 }).map((_, i) => ({
      value: Number((i * 0.1).toFixed(1)),
      label: `${(i + 1) * 10}`,
    })),
    requiresReload: false,
  },
  // TODO:
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
  {
    key: "musicPreference",
    label: t("settings:musicPreference"),
    options: [
      { value: MusicPreference.CONSISTENT, label: t("settings:consistent") },
      { value: MusicPreference.MIXED, label: t("settings:mixed") },
    ],
    requiresReload: true,
  },
];
