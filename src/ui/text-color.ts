import { settings } from "#app/system/settings/settings-manager";
import { ShadowColor, TextColor, CommonColor } from "#enums/color";
import { TextStyle } from "#enums/text-style";
import { UiTheme } from "#enums/ui-theme";
import type { TextColorCombination } from "#app/ui/interfaces/text-color-combination";

/**
 * Object linking each {@linkcode TextColor} to a {@linkcode CommonColor} and {@linkcode ShadowColor}.
 */
const allTextColorCombinations: { [key: string]: TextColorCombination } = Object.freeze({
  [TextColor.WHITE_DARK_PURPLE_SHADOW]: { mainColor: CommonColor.OFF_WHITE, shadowColor: ShadowColor.PURPLE },
  [TextColor.WHITE_DARK_GREY_SHADOW]: { mainColor: CommonColor.OFF_WHITE, shadowColor: ShadowColor.GREY },
  [TextColor.GREY_DARK_SHADOW]: { mainColor: CommonColor.LIGHT_GREY, shadowColor: ShadowColor.GREY },
  [TextColor.DARK_GREY_LIGHT_SHADOW]: { mainColor: CommonColor.GREY, shadowColor: ShadowColor.LIGHT_GREY },

  [TextColor.PINK_DARK_BROWN_SHADOW]: { mainColor: CommonColor.SOFT_PINK, shadowColor: ShadowColor.DEEP_RED },
  [TextColor.PINK_DARK_RED_SHADOW]: { mainColor: CommonColor.CORAL_PINK, shadowColor: ShadowColor.BRIGHT_RED },

  [TextColor.RED_LIGHT_ORANGE_SHADOW]: { mainColor: CommonColor.DEEP_RED, shadowColor: ShadowColor.LIGHT_ORANGE },
  [TextColor.RED_LIGHT_PINK_SHADOW]: { mainColor: CommonColor.WARM_RED, shadowColor: ShadowColor.LIGHT_RED },
  [TextColor.RED_DARK_BROWN_SHADOW]: { mainColor: CommonColor.WARM_RED, shadowColor: ShadowColor.DARK_BROWN },

  [TextColor.DARK_ORANGE_DARK_BROWN_SHADOW]: {
    mainColor: CommonColor.DEEP_ORANGE,
    shadowColor: ShadowColor.LIGHT_BROWN,
  },
  [TextColor.DARK_ORANGE_LIGHT_SHADOW]: { mainColor: CommonColor.DEEP_ORANGE, shadowColor: ShadowColor.PEACH_SAND },
  [TextColor.ORANGE_DARK_SHADOW]: { mainColor: CommonColor.SOFT_ORANGE, shadowColor: ShadowColor.ORANGE },

  [TextColor.LIGHT_YELLOW_DARK_SHADOW]: { mainColor: CommonColor.MUTED_YELLOW, shadowColor: ShadowColor.DARK_YELLOW },
  [TextColor.YELLOW_DARK_SHADOW]: { mainColor: CommonColor.DEEP_YELLOW, shadowColor: ShadowColor.OLIVE_BRONZE },
  [TextColor.DARK_YELLOW_LIGHT_SHADOW]: { mainColor: CommonColor.DARK_YELLOW, shadowColor: ShadowColor.YELLOW },

  [TextColor.GREEN_DARK_SHADOW]: { mainColor: CommonColor.LIGHT_GREEN, shadowColor: ShadowColor.GREEN },
  [TextColor.BLUE_DARK_SHADOW]: { mainColor: CommonColor.LIGHT_BLUE, shadowColor: ShadowColor.BLUE },
});

/**
 * Retrieve the colors associated with the given TextStyle, based on the current {@linkcode UiTheme}.
 * @param textStyle the {@linkcode TextStyle} to retrieve colors for
 * @returns a {@linkcode TextColorCombination} consisting of a {@linkcode CommonColor} and {@linkcode ShadowColor}.
 */
export function getTextColorCombination(textStyle: TextStyle): TextColorCombination {
  let textColor: TextColor | undefined;
  if (settings.display.uiTheme === UiTheme.LIGHT) {
    textColor = getLightThemeTextColor(textStyle);
  }
  if (textColor === undefined) {
    textColor = getDefaultTextColor(textStyle);
  }
  return allTextColorCombinations[textColor];
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
      return TextColor.WHITE_DARK_PURPLE_SHADOW;
    // White text, grey shadow
    case TextStyle.SUMMARY:
    case TextStyle.PARTY:
      return TextColor.WHITE_DARK_GREY_SHADOW;
    // Orange text, orange shadow
    case TextStyle.STATS_LABEL:
    case TextStyle.CHALLENGE_DESCRIPTION:
    case TextStyle.SETTINGS_LABEL:
    case TextStyle.PERFECT_IV:
      return TextColor.ORANGE_DARK_SHADOW;
    // Grey text, light grey shadow
    case TextStyle.WINDOW_ALT:
    case TextStyle.SMALLER_WINDOW_ALT:
    case TextStyle.SUMMARY_ALT:
      return TextColor.DARK_GREY_LIGHT_SHADOW;
    // Light grey text, grey shadow
    case TextStyle.SETTINGS_LOCKED:
    case TextStyle.SUMMARY_GRAY:
      return TextColor.GREY_DARK_SHADOW;
    // Light yellow text, dark yellow shadow
    case TextStyle.SUMMARY_GOLD:
    case TextStyle.MONEY:
    case TextStyle.MONEY_WINDOW:
      return TextColor.LIGHT_YELLOW_DARK_SHADOW;
    // Light green text, green shadow
    case TextStyle.ME_OPTION_SPECIAL:
    case TextStyle.SUMMARY_GREEN:
      return TextColor.GREEN_DARK_SHADOW;
    // Light blue text, blue shadow
    case TextStyle.SUMMARY_BLUE:
    case TextStyle.GENDER_MALE:
      return TextColor.BLUE_DARK_SHADOW;
    // Pink text, red shadow
    case TextStyle.PARTY_RED:
    case TextStyle.SUMMARY_PINK:
    case TextStyle.GENDER_FEMALE:
      return TextColor.PINK_DARK_BROWN_SHADOW;
    // Deep red text, light orange shadow
    case TextStyle.SUMMARY_RED:
    case TextStyle.TOOLTIP_TITLE:
      return TextColor.RED_LIGHT_ORANGE_SHADOW;
    // Red text, dark brown shadow
    case TextStyle.MOVE_PP_EMPTY:
      return TextColor.RED_DARK_BROWN_SHADOW;
    // Dark orange text, light brown shadow
    case TextStyle.MOVE_PP_NEAR_EMPTY:
      return TextColor.DARK_ORANGE_DARK_BROWN_SHADOW;
    // Dark yellow text, olive bronze shadow
    case TextStyle.MOVE_PP_HALF_FULL:
      return TextColor.YELLOW_DARK_SHADOW;
    // Coral pink text, bright red shadow
    case TextStyle.SETTINGS_SELECTED:
      return TextColor.PINK_DARK_RED_SHADOW;
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
      return TextColor.DARK_GREY_LIGHT_SHADOW;
    // Orange/Gold text and shadow
    case TextStyle.ME_OPTION_SPECIAL:
    case TextStyle.MONEY_WINDOW:
      return TextColor.ORANGE_DARK_SHADOW;
    // Dark yellow text, yellow shadow
    case TextStyle.MOVE_PP_HALF_FULL:
      return TextColor.DARK_YELLOW_LIGHT_SHADOW;
    // Red text, light red shadow
    case TextStyle.MOVE_PP_EMPTY:
      return TextColor.RED_LIGHT_PINK_SHADOW;
    // Dark orange text, peach sand shadow
    case TextStyle.MOVE_PP_NEAR_EMPTY:
      return TextColor.DARK_ORANGE_LIGHT_SHADOW;
  }
}
