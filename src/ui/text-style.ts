import type { SupportedLanguageKey } from "#app/@types/Language";
import { settings } from "#app/system/settings/settings-manager";
import { DEFAULT_LANGUAGE_KEY } from "#app/system/settings/supported-languages";
import type { TextStyleOptions } from "#app/ui/interfaces/text-style-options";
import { allTextColors } from "#app/ui/text-color";
import { TextColor } from "#enums/color";
import { TextFormat } from "#enums/text-format";
import { TextStyle } from "#enums/text-style";
import { UiTheme } from "#enums/ui-theme";
import i18next from "i18next";
import { allTextFormats } from "./text-format";

interface ModularTextStyleOptions {
  color: TextColor | Record<UiTheme, TextColor>;
  format: TextFormat | Partial<Record<SupportedLanguageKey, TextFormat>>;
}

/**
 * Object linking each {@linkcode TextStyle} to a {@linkcode ModularTextStyleOptions}.
 */
const allTextStyles: Record<TextStyle, ModularTextStyleOptions> = {
  [TextStyle.MESSAGE]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.WINDOW]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.WINDOW_ALT]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SMALLER_WINDOW_ALT]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    format: TextFormat.DEFAULT_FONT_60PX,
  },

  [TextStyle.TOOLTIP_TITLE]: {
    color: TextColor.RED_LIGHT_ORANGE_SHADOW,
    format: TextFormat.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },
  [TextStyle.TOOLTIP_CONTENT]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_64PX,
  },

  [TextStyle.MONEY]: {
    color: TextColor.LIGHT_YELLOW_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },
  [TextStyle.MONEY_WINDOW]: {
    color: {
      [UiTheme.DARK]: TextColor.LIGHT_YELLOW_DARK_SHADOW,
      [UiTheme.LIGHT]: TextColor.ORANGE_DARK_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },

  [TextStyle.ME_OPTION_DEFAULT]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.ME_OPTION_SPECIAL]: {
    color: {
      [UiTheme.DARK]: TextColor.GREEN_DARK_SHADOW,
      [UiTheme.LIGHT]: TextColor.ORANGE_DARK_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_96PX,
  },

  [TextStyle.BATTLE_INFO]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    format: TextFormat.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },
  [TextStyle.PERFECT_IV]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.MOVE_INFO_CONTENT]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_56PX,
  },
  [TextStyle.MOVE_PP_FULL]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.MOVE_PP_HALF_FULL]: {
    color: {
      [UiTheme.DARK]: TextColor.YELLOW_DARK_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_YELLOW_LIGHT_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.MOVE_PP_NEAR_EMPTY]: {
    color: {
      [UiTheme.DARK]: TextColor.DARK_ORANGE_DARK_BROWN_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_ORANGE_LIGHT_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.MOVE_PP_EMPTY]: {
    color: {
      [UiTheme.DARK]: TextColor.RED_DARK_BROWN_SHADOW,
      [UiTheme.LIGHT]: TextColor.RED_LIGHT_PINK_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.BGM_BAR]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    format: TextFormat.DEFAULT_FONT_72PX,
  },

  [TextStyle.SUMMARY]: {
    color: TextColor.WHITE_DARK_GREY_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_ALT]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_GRAY]: {
    color: TextColor.GREY_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_GOLD]: {
    color: TextColor.LIGHT_YELLOW_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_GREEN]: {
    color: TextColor.GREEN_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_BLUE]: {
    color: TextColor.BLUE_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_PINK]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_RED]: {
    color: TextColor.RED_LIGHT_ORANGE_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX,
  },

  [TextStyle.PARTY]: {
    color: TextColor.WHITE_DARK_GREY_SHADOW,
    format: TextFormat.ALT_FONT_66PX,
  },
  [TextStyle.PARTY_RED]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    format: TextFormat.ALT_FONT_66PX,
  },

  [TextStyle.SETTINGS_VALUE]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.SETTINGS_LABEL]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.SETTINGS_SELECTED]: {
    color: TextColor.PINK_DARK_RED_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.SETTINGS_LOCKED]: {
    color: TextColor.GREY_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.CHALLENGE_DESCRIPTION]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    format: TextFormat.DEFAULT_FONT_84PX_BIG_SHADOW,
  },

  [TextStyle.STATS_LABEL]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    format: {
      ["en"]: TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW,
      ["de"]: TextFormat.DEFAULT_FONT_80PX,
    },
  },
  [TextStyle.STATS_VALUE]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    format: {
      [DEFAULT_LANGUAGE_KEY]: TextFormat.DEFAULT_FONT_96PX,
      ["de"]: TextFormat.DEFAULT_FONT_80PX,
    },
  },
};

export function getTextStyle(style: TextStyle): TextStyleOptions {
  const { color, format } = allTextStyles[style];

  let colorId: TextColor;
  if (typeof color === "number") {
    colorId = color;
  } else {
    colorId = color[settings.display.uiTheme];
  }

  let formatId: TextFormat;
  if (typeof format === "number") {
    formatId = format;
  } else {
    const lang = i18next.resolvedLanguage ?? DEFAULT_LANGUAGE_KEY;
    if (format[lang] !== undefined) {
      formatId = format[lang];
    } else if (format[DEFAULT_LANGUAGE_KEY] !== undefined) {
      formatId = format[DEFAULT_LANGUAGE_KEY];
    } else {
      console.warn(
        `TextStyleId "${TextStyle[style]}" missing format for default langauge key "${DEFAULT_LANGUAGE_KEY}"`,
      );
      formatId = Object.values(format)[0]; // default to the first defined format
    }
  }

  return { color: allTextColors[colorId], format: allTextFormats[formatId] };
}
