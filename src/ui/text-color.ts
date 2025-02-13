import { settings } from "#app/system/settings/settings-manager";
import { ShadowColor, TextColor, CommonColor } from "#enums/color";
import { TextStyle } from "#enums/text-style";
import { UiTheme } from "#enums/ui-theme";

/**
 * Combination of a {@linkcode CommonColor} and {@linkcode ShadowColor} used for text elements.
 */
interface TextColorCombination {
  mainColor: CommonColor;
  shadowColor: ShadowColor;
}

/**
 * Object linking each {@linkcode TextColor} to a {@linkcode CommonColor} and {@linkcode ShadowColor}.
 */
const colorCombinations: { [key: string]: TextColorCombination } = Object.freeze({
  [TextColor.OFF_WHITE_PURPLE]: { mainColor: CommonColor.OFF_WHITE, shadowColor: ShadowColor.PURPLE },
  [TextColor.OFF_WHITE_GREY]: { mainColor: CommonColor.OFF_WHITE, shadowColor: ShadowColor.GREY },
  [TextColor.GREY_LIGHT_GREY]: { mainColor: CommonColor.GREY, shadowColor: ShadowColor.LIGHT_GREY },
  [TextColor.LIGHT_GREY_GREY]: { mainColor: CommonColor.LIGHT_GREY, shadowColor: ShadowColor.GREY },
  [TextColor.MUTED_YELLOW_DARK_YELLOW]: { mainColor: CommonColor.MUTED_YELLOW, shadowColor: ShadowColor.DARK_YELLOW },
  [TextColor.DARK_YELLOW_YELLOW]: { mainColor: CommonColor.DARK_YELLOW, shadowColor: ShadowColor.YELLOW },
  [TextColor.SOFT_ORANGE_ORANGE]: { mainColor: CommonColor.SOFT_ORANGE, shadowColor: ShadowColor.ORANGE },
  [TextColor.LIGHT_GREEN_SOFT_GREEN]: { mainColor: CommonColor.LIGHT_GREEN, shadowColor: ShadowColor.SOFT_GREEN },
  [TextColor.LIGHT_BLUE]: { mainColor: CommonColor.LIGHT_BLUE, shadowColor: ShadowColor.LIGHT_BLUE },
  [TextColor.SOFT_PINK_DEEP_RED]: { mainColor: CommonColor.SOFT_PINK, shadowColor: ShadowColor.DEEP_RED },
  [TextColor.WARM_RED_LIGHT_RED]: { mainColor: CommonColor.WARM_RED, shadowColor: ShadowColor.LIGHT_RED },
  [TextColor.WARM_RED_DARK_BROWN]: { mainColor: CommonColor.WARM_RED, shadowColor: ShadowColor.DARK_BROWN },
  [TextColor.DEEP_ORANGE_LIGHT_BROWN]: { mainColor: CommonColor.DEEP_ORANGE, shadowColor: ShadowColor.LIGHT_BROWN },
  [TextColor.DEEP_RED_LIGHT_ORANGE]: { mainColor: CommonColor.DEEP_RED, shadowColor: ShadowColor.LIGHT_ORANGE },
  [TextColor.DEEP_YELLOW_OLIVE_BRONZE]: { mainColor: CommonColor.DEEP_YELLOW, shadowColor: ShadowColor.OLIVE_BRONZE },
  [TextColor.DEEP_ORANGE_PEACH_SAND]: { mainColor: CommonColor.DEEP_ORANGE, shadowColor: ShadowColor.PEACH_SAND },
  [TextColor.CORAL_PINK_BRIGHT_RED]: { mainColor: CommonColor.CORAL_PINK, shadowColor: ShadowColor.BRIGHT_RED },
});

/**
 * Retrieve the colors associated with the given TextStyle, based on the current {@linkcode UiTheme}.
 * @param textStyle the {@linkcode TextStyle} to retrieve colors for
 * @returns a {@linkcode TextColorCombination} consisting of a {@linkcode CommonColor} and {@linkcode ShadowColor};
 */
export function getTextColorCombination(textStyle: TextStyle): TextColorCombination {
  let colorCombination: TextColor | undefined;
  if (settings.display.uiTheme === UiTheme.LIGHT) {
    colorCombination = getLightThemeTextColor(textStyle);
  }
  if (colorCombination === undefined) {
    colorCombination = getDefaultTextColor(textStyle);
  }
  return colorCombinations[colorCombination];
}

/**
 * Get the {@linkcode TextColor} associated with the given {@linkcode TextStyle}.
 * This does not take into account any variations introduced by various UIThemes.
 */
function getDefaultTextColor(textStyle: TextStyle): TextColor {
  switch (textStyle) {
    // White text, purple shadow
    case TextStyle.MESSAGE:
    case TextStyle.WINDOW:
    case TextStyle.MOVE_INFO_CONTENT:
    case TextStyle.MOVE_PP_FULL:
    case TextStyle.TOOLTIP_CONTENT:
    case TextStyle.SETTINGS_VALUE:
    case TextStyle.STATS_VALUE:
    case TextStyle.BATTLE_INFO:
    case TextStyle.BGM_BAR:
    case TextStyle.ME_OPTION_DEFAULT:
      return TextColor.OFF_WHITE_PURPLE;
    // White text, grey shadow
    case TextStyle.SUMMARY:
    case TextStyle.PARTY:
      return TextColor.OFF_WHITE_GREY;
    // Orange text, orange shadow
    case TextStyle.STATS_LABEL:
    case TextStyle.CHALLENGE_DESCRIPTION:
    case TextStyle.SETTINGS_LABEL:
    case TextStyle.PERFECT_IV:
      return TextColor.SOFT_ORANGE_ORANGE;
    // Grey text, light grey shadow
    case TextStyle.WINDOW_ALT:
    case TextStyle.SMALLER_WINDOW_ALT:
    case TextStyle.SUMMARY_ALT:
      return TextColor.GREY_LIGHT_GREY;
    // Light grey text, grey shadow
    case TextStyle.SETTINGS_LOCKED:
    case TextStyle.SUMMARY_GRAY:
      return TextColor.LIGHT_GREY_GREY;
    // Light yellow text, dark yellow shadow
    case TextStyle.SUMMARY_GOLD:
    case TextStyle.MONEY:
    case TextStyle.MONEY_WINDOW:
      return TextColor.MUTED_YELLOW_DARK_YELLOW;
    // Light green text, green shadow
    case TextStyle.ME_OPTION_SPECIAL:
    case TextStyle.SUMMARY_GREEN:
      return TextColor.LIGHT_GREEN_SOFT_GREEN;
    // Light blue text, blue shadow
    case TextStyle.SUMMARY_BLUE:
      return TextColor.LIGHT_BLUE;
    // Pink text, red shadow
    case TextStyle.PARTY_RED:
    case TextStyle.SUMMARY_PINK:
      return TextColor.SOFT_PINK_DEEP_RED;
    // Deep red text, light orange shadow
    case TextStyle.SUMMARY_RED:
    case TextStyle.TOOLTIP_TITLE:
      return TextColor.DEEP_RED_LIGHT_ORANGE;
    // Red text, dark brown shadow
    case TextStyle.MOVE_PP_EMPTY:
      return TextColor.WARM_RED_DARK_BROWN;
    // Dark orange text, light brown shadow
    case TextStyle.MOVE_PP_NEAR_EMPTY:
      return TextColor.DEEP_ORANGE_LIGHT_BROWN;
    // Dark yellow text, olive bronze shadow
    case TextStyle.MOVE_PP_HALF_FULL:
      return TextColor.DEEP_YELLOW_OLIVE_BRONZE;
    // Coral pink text, bright red shadow
    case TextStyle.SETTINGS_SELECTED:
      return TextColor.CORAL_PINK_BRIGHT_RED;
  }
}

/**
 * Get the {@linkcode TextColor} associated with the given {@linkcode TextStyle} with the UI light theme.
 * @returns a {@linkcode TextColor} if a specific color is defined compared to the default, `undefined` otherwise.
 */
function getLightThemeTextColor(textStyle: TextStyle): TextColor | undefined {
  switch (textStyle) {
    // Grey text, light grey shadow
    case TextStyle.WINDOW:
    case TextStyle.MOVE_INFO_CONTENT:
    case TextStyle.MOVE_PP_FULL:
    case TextStyle.TOOLTIP_CONTENT:
    case TextStyle.SETTINGS_VALUE:
    case TextStyle.STATS_VALUE:
      return TextColor.GREY_LIGHT_GREY;
    // Orange/Gold text and shadow
    case TextStyle.ME_OPTION_SPECIAL:
    case TextStyle.MONEY_WINDOW:
      return TextColor.SOFT_ORANGE_ORANGE;
    // Dark yellow text, yellow shadow
    case TextStyle.MOVE_PP_HALF_FULL:
      return TextColor.DARK_YELLOW_YELLOW;
    // Red text, light red shadow
    case TextStyle.MOVE_PP_EMPTY:
      return TextColor.WARM_RED_LIGHT_RED;
    // Dark orange text, peach sand shadow
    case TextStyle.MOVE_PP_NEAR_EMPTY:
      return TextColor.DEEP_ORANGE_PEACH_SAND;
  }
}
