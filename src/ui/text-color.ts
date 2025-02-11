import { settings } from "#app/system/settings/settings-manager";
import { ShadowColor, TextColor, Color } from "#enums/color";
import { TextStyle } from "#enums/text-style";
import { UiTheme } from "#enums/ui-theme";

/**
 * Combination of a {@linkcode Color} and {@linkcode ShadowColor} used for text elements.
 */
interface TextColorCombination {
  mainColor: Color;
  shadowColor: ShadowColor;
}

/**
 * Object linking each {@linkcode TextColor} to a {@linkcode Color} and {@linkcode ShadowColor}.
 */
const colorCombinations: { [key: string]: TextColorCombination } = {
  [TextColor.OFF_WHITE_PURPLE]: { mainColor: Color.OFF_WHITE, shadowColor: ShadowColor.PURPLE },
  [TextColor.OFF_WHITE_GREY]: { mainColor: Color.OFF_WHITE, shadowColor: ShadowColor.GREY },
  [TextColor.GREY_LIGHT_GREY]: { mainColor: Color.GREY, shadowColor: ShadowColor.LIGHT_GREY },
  [TextColor.LIGHT_GREY_GREY]: { mainColor: Color.LIGHT_GREY, shadowColor: ShadowColor.GREY },
  [TextColor.LIGHT_YELLOW_DARK_YELLOW]: { mainColor: Color.LIGHT_YELLOW, shadowColor: ShadowColor.DARK_YELLOW },
  [TextColor.DARK_YELLOW_YELLOW]: { mainColor: Color.DARK_YELLOW, shadowColor: ShadowColor.YELLOW },
  [TextColor.ORANGE]: { mainColor: Color.ORANGE, shadowColor: ShadowColor.ORANGE },
  [TextColor.GREEN]: { mainColor: Color.GREEN, shadowColor: ShadowColor.GREEN },
  [TextColor.BLUE]: { mainColor: Color.BLUE, shadowColor: ShadowColor.BLUE },
  [TextColor.PINK_RED]: { mainColor: Color.PINK, shadowColor: ShadowColor.RED },
  [TextColor.RED_PINK]: { mainColor: Color.RED, shadowColor: ShadowColor.PINK },
  [TextColor.RED_MAROON]: { mainColor: Color.RED, shadowColor: ShadowColor.MAROON },
  [TextColor.RED_ORANGE_BROWN]: { mainColor: Color.RED_ORANGE, shadowColor: ShadowColor.BROWN },
  [TextColor.BRIGHT_RED_LIGHT_ORANGE]: { mainColor: Color.BRIGHT_RED, shadowColor: ShadowColor.LIGHT_ORANGE },
  [TextColor.YELLOW_MUSTARD]: { mainColor: Color.YELLOW, shadowColor: ShadowColor.MUSTARD },
  [TextColor.RED_ORANGE_LIGHT_SALMON]: { mainColor: Color.RED_ORANGE, shadowColor: ShadowColor.LIGHT_SALMON },
  [TextColor.DARK_PINK_BRIGHT_RED]: { mainColor: Color.DARK_PINK, shadowColor: ShadowColor.BRIGHT_RED },
};

/**
 * Retrieve the colors associated with the given TextStyle, based on the current {@linkcode UiTheme}.
 * @param textStyle the {@linkcode TextStyle} to retrieve colors for
 * @returns a {@linkcode TextColorCombination} consisting of a {@linkcode Color} and {@linkcode ShadowColor};
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
      return TextColor.ORANGE;
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
      return TextColor.LIGHT_YELLOW_DARK_YELLOW;
    // Green text and shadow
    case TextStyle.ME_OPTION_SPECIAL:
    case TextStyle.SUMMARY_GREEN:
      return TextColor.GREEN;
    // Blue text and shadow
    case TextStyle.SUMMARY_BLUE:
      return TextColor.BLUE;
    // Pink text, red shadow
    case TextStyle.PARTY_RED:
    case TextStyle.SUMMARY_PINK:
      return TextColor.PINK_RED;
    // Bright red text, light orange shadow
    case TextStyle.SUMMARY_RED:
    case TextStyle.TOOLTIP_TITLE:
      return TextColor.BRIGHT_RED_LIGHT_ORANGE;
    // Red text, maroon shadow
    case TextStyle.MOVE_PP_EMPTY:
      return TextColor.RED_MAROON;
    // Red-orange text, brown shadow
    case TextStyle.MOVE_PP_NEAR_EMPTY:
      return TextColor.RED_ORANGE_BROWN;
    // Yellow text, mustard shadow
    case TextStyle.MOVE_PP_HALF_FULL:
      return TextColor.YELLOW_MUSTARD;
    // Dark pink text, bright red shadow
    case TextStyle.SETTINGS_SELECTED:
      return TextColor.DARK_PINK_BRIGHT_RED;
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
      return TextColor.ORANGE;
    // Dark yellow text, yellow shadow
    case TextStyle.MOVE_PP_HALF_FULL:
      return TextColor.DARK_YELLOW_YELLOW;
    // Red text, pink shadow
    case TextStyle.MOVE_PP_EMPTY:
      return TextColor.RED_PINK;
    // Red-orange text, light salmon shadow
    case TextStyle.MOVE_PP_NEAR_EMPTY:
      return TextColor.RED_ORANGE_LIGHT_SALMON;
  }
}
