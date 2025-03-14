import type { SupportedLanguageKey } from "#app/@types/Language";
import { settings } from "#app/system/settings/settings-manager";
import { DEFAULT_LANGUAGE_KEY } from "#app/system/settings/supported-languages";
import type { TextStyleOptions } from "#app/ui/interfaces/text-style-options";
import { allTextFormats } from "#app/ui/text/font-style";
import { allTextColors } from "#app/ui/text/text-color";
import { TextColor } from "#enums/color";
import { FontStyle } from "#enums/font-style";
import { TextStyle } from "#enums/text-style";
import { UiTheme } from "#enums/ui-theme";
import i18next from "i18next";

interface ModularTextStyleOptions {
  color: TextColor | Record<UiTheme, TextColor>;
  fontStyle: FontStyle | Partial<Record<SupportedLanguageKey, FontStyle>>;
}

/**
 * Object linking each {@linkcode TextStyle} to a {@linkcode ModularTextStyleOptions}.
 */
const allTextStyles: Record<TextStyle, ModularTextStyleOptions> = {
  [TextStyle.MESSAGE]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.WINDOW]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.WINDOW_SMALL]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_54PX,
  },
  [TextStyle.WINDOW_ALT]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.WINDOW_ALT_SMALL]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_60PX,
  },

  [TextStyle.WINDOW_MODAL_INFO]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_48PX,
  },
  [TextStyle.WINDOW_MODAL_ERROR]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_64PX,
  },
  [TextStyle.REGISTRATION_FORM_WARNING]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_42PX,
  },
  [TextStyle.REGISTRATION_FORM_ERROR]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_64PX,
      ["es-ES"]: FontStyle.DEFAULT_FONT_40PX,
    },
  },
  [TextStyle.REGISTRATION_FORM_LABEL]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_64PX,
      ["es-ES"]: FontStyle.DEFAULT_FONT_50PX,
    },
  },

  [TextStyle.TOOLTIP_TITLE]: {
    color: TextColor.RED_LIGHT_ORANGE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },
  [TextStyle.TOOLTIP_CONTENT]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_64PX,
  },

  [TextStyle.TITLE_SCREEN]: {
    color: TextColor.LIGHT_YELLOW_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_54PX,
  },

  [TextStyle.MONEY]: {
    color: TextColor.LIGHT_YELLOW_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },
  [TextStyle.MONEY_WINDOW]: {
    color: {
      [UiTheme.DARK]: TextColor.LIGHT_YELLOW_DARK_SHADOW,
      [UiTheme.LIGHT]: TextColor.ORANGE_DARK_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },

  [TextStyle.CATCH_PANEL_LABEL]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_64PX,
      ["pt-BR"]: FontStyle.DEFAULT_FONT_60PX,
    },
  },
  [TextStyle.CATCH_PANEL_HEADER]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_64PX,
  },
  [TextStyle.EGG_SUMMARY_LABEL]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_64PX,
      ["pt-BR"]: FontStyle.DEFAULT_FONT_60PX,
    },
  },
  [TextStyle.EGG_SUMMARY_CANDY]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_56PX,
  },
  [TextStyle.EGG_SUMMARY_HEADER]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_72PX,
  },

  [TextStyle.RUN_HISTORY_TRAINER_INFO]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_34PX,
  },
  [TextStyle.RUN_HISTORY_POKEMON_INFO]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_34PX,
  },
  [TextStyle.RUN_HISTORY_ME_INFO]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_44PX,
  },
  [TextStyle.RUN_HISTORY_VICTORY]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_64PX,
  },
  [TextStyle.RUN_HISTORY_DEFEAT]: {
    color: TextColor.RED_LIGHT_ORANGE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_64PX,
  },
  [TextStyle.RUN_PREVIEW_STATUS]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_60PX,
  },
  [TextStyle.RUN_PREVIEW_DETAILS]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_50PX,
  },

  // TODO: once light theme has its own window color in battle, we will need a different color in light theme
  // for ME_OPTION_DEFAULT: DARK_GREY_LIGHT_SHADOW and for ME_OPTION_SPECIAL: ORANGE_DARK_SHADOW
  [TextStyle.ME_OPTION_DEFAULT]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_80PX,
  },
  [TextStyle.ME_OPTION_SPECIAL]: {
    color: TextColor.GREEN_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_80PX,
  },
  [TextStyle.ME_OPTION_DETAILS]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_72PX,
  },

  [TextStyle.ARENA_FLYOUT_HEADER]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_54PX,
  },
  [TextStyle.ARENA_FLYOUT_PLAYER_HEADER]: {
    color: TextColor.BLUE_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_54PX,
  },
  [TextStyle.ARENA_FLYOUT_NEUTRAL_HEADER]: {
    color: TextColor.GREEN_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_54PX,
  },
  [TextStyle.ARENA_FLYOUT_ENEMY_HEADER]: {
    color: TextColor.RED_LIGHT_ORANGE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_54PX,
  },
  [TextStyle.ARENA_FLYOUT_CONTENT]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_48PX,
  },

  [TextStyle.BATTLE_FLYOUT_MOVE_INFO]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_44PX,
  },
  [TextStyle.BATTLE_INFO]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_72PX_MEDIUM_SHADOW,
  },
  [TextStyle.PERFECT_IV]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.MOVE_INFO_CONTENT]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_56PX,
  },
  [TextStyle.MOVE_PP_FULL]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.MOVE_PP_HALF_FULL]: {
    color: {
      [UiTheme.DARK]: TextColor.YELLOW_DARK_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_YELLOW_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.MOVE_PP_NEAR_EMPTY]: {
    color: {
      [UiTheme.DARK]: TextColor.DARK_ORANGE_DARK_BROWN_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_ORANGE_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.MOVE_PP_EMPTY]: {
    color: {
      [UiTheme.DARK]: TextColor.RED_DARK_BROWN_SHADOW,
      [UiTheme.LIGHT]: TextColor.RED_LIGHT_PINK_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.NOTIFICATION_BAR_LIGHT]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_72PX,
  },
  [TextStyle.NOTIFICATION_BAR_DARK]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_72PX,
  },

  [TextStyle.SUMMARY]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_ALT]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_ALT_SMALL]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_76PX,
  },
  [TextStyle.SUMMARY_GRAY]: {
    color: TextColor.GREY_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_GOLD]: {
    color: TextColor.LIGHT_YELLOW_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_GREEN]: {
    color: TextColor.GREEN_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_BLUE]: {
    color: TextColor.BLUE_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_PINK]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.SUMMARY_RED]: {
    color: TextColor.RED_LIGHT_ORANGE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },

  [TextStyle.SCORE]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: FontStyle.ALT_FONT_54PX,
  },

  [TextStyle.PARTY]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: FontStyle.ALT_FONT_66PX,
  },
  [TextStyle.PARTY_RED]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    fontStyle: FontStyle.ALT_FONT_66PX,
  },

  [TextStyle.SETTINGS_VALUE]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.SETTINGS_LABEL]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.SETTINGS_SELECTED]: {
    color: TextColor.PINK_DARK_RED_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },
  [TextStyle.SETTINGS_LOCKED]: {
    color: TextColor.GREY_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
  },

  [TextStyle.CHALLENGE_DESCRIPTION]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_84PX_BIG_SHADOW,
  },

  [TextStyle.GACHA_LABEL]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_96PX,
      ["de"]: FontStyle.DEFAULT_FONT_60PX,
      ["es-ES"]: FontStyle.DEFAULT_FONT_60PX,
      ["fr"]: FontStyle.DEFAULT_FONT_60PX,
      ["ko"]: FontStyle.DEFAULT_FONT_60PX,
      ["pt-BR"]: FontStyle.DEFAULT_FONT_60PX,
    },
  },
  [TextStyle.GACHA_OPTIONS]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: FontStyle.DEFAULT_FONT_80PX,
  },

  [TextStyle.STATS_LABEL]: {
    color: TextColor.ORANGE_DARK_SHADOW,
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW,
      ["de"]: FontStyle.DEFAULT_FONT_80PX,
    },
  },
  [TextStyle.STATS_VALUE]: {
    color: {
      [UiTheme.DARK]: TextColor.WHITE_DARK_PURPLE_SHADOW,
      [UiTheme.LIGHT]: TextColor.DARK_GREY_LIGHT_SHADOW,
    },
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_96PX,
      ["de"]: FontStyle.DEFAULT_FONT_80PX,
    },
  },

  [TextStyle.END_CARD]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_128PX,
  },

  [TextStyle.POKEMON_LEVEL]: {
    color: TextColor.WHITE_DARK_GREY_SHADOW,
    fontStyle: FontStyle.ALT_FONT_54PX_STROKE,
  },
  [TextStyle.POKEMON_LEVEL_SMALL]: {
    color: TextColor.WHITE_DARK_GREY_SHADOW,
    fontStyle: FontStyle.ALT_FONT_44PX_STROKE,
  },
  [TextStyle.BOSS_POKEMON_LEVEL]: {
    color: TextColor.PINK_DARK_GREY_SHADOW,
    fontStyle: FontStyle.ALT_FONT_54PX_STROKE,
  },
  [TextStyle.BOSS_POKEMON_LEVEL_SMALL]: {
    color: TextColor.PINK_DARK_GREY_SHADOW,
    fontStyle: FontStyle.ALT_FONT_44PX_STROKE,
  },

  [TextStyle.LAPSING_MODIFIER_COUNT]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    fontStyle: FontStyle.ALT_FONT_66PX_STROKE,
  },

  [TextStyle.STARTER_COST]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_32PX,
  },
  [TextStyle.STARTER_STATS]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_56PX,
  },
  [TextStyle.STARTER_LUCK]: {
    color: TextColor.WHITE_DARK_PURPLE_SHADOW, // White because it gets tinted
    fontStyle: FontStyle.DEFAULT_FONT_56PX,
  },
  [TextStyle.STARTER_FORM]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_42PX,
  },
  [TextStyle.STARTER_GROWTH_RATE]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_36PX,
  },
  [TextStyle.STARTER_INFO]: {
    color: TextColor.DARK_GREY_LIGHT_SHADOW,
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.DEFAULT_FONT_56PX,
      ["de"]: FontStyle.DEFAULT_FONT_48PX,
      ["fr"]: FontStyle.DEFAULT_FONT_54PX,
      ["ja"]: FontStyle.DEFAULT_FONT_52PX,
      ["ko"]: FontStyle.DEFAULT_FONT_52PX,
      ["pt-BR"]: FontStyle.DEFAULT_FONT_48PX,
      ["zh-CN"]: FontStyle.DEFAULT_FONT_48PX,
      ["zh-TW"]: FontStyle.DEFAULT_FONT_48PX,
    },
  },
  [TextStyle.STARTER_INSTRUCTIONS]: {
    color: TextColor.WHITE_GREY_SHADOW,
    fontStyle: {
      [DEFAULT_LANGUAGE_KEY]: FontStyle.ALT_FONT_38PX,
      ["de"]: FontStyle.ALT_FONT_35PX,
      ["es-ES"]: FontStyle.ALT_FONT_35PX,
    },
  },
  // TODO: these are not really textstyles and only used to update the color of existing text
  [TextStyle.GENDER_FEMALE]: {
    color: TextColor.PINK_DARK_BROWN_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
  [TextStyle.GENDER_MALE]: {
    color: TextColor.BLUE_DARK_SHADOW,
    fontStyle: FontStyle.DEFAULT_FONT_96PX,
  },
};

export function getTextStyle(style: TextStyle): TextStyleOptions {
  const { color, fontStyle } = allTextStyles[style];

  let colorId: TextColor;
  if (typeof color === "number") {
    colorId = color;
  } else {
    colorId = color[settings.display.uiTheme];
  }

  let fontStyleId: FontStyle;
  if (typeof fontStyle === "number") {
    fontStyleId = fontStyle;
  } else {
    const lang = i18next.resolvedLanguage ?? DEFAULT_LANGUAGE_KEY;
    if (fontStyle[lang] !== undefined) {
      fontStyleId = fontStyle[lang];
    } else if (fontStyle[DEFAULT_LANGUAGE_KEY] !== undefined) {
      fontStyleId = fontStyle[DEFAULT_LANGUAGE_KEY];
    } else {
      console.warn(
        `TextStyleId "${TextStyle[style]}" missing format for default langauge key "${DEFAULT_LANGUAGE_KEY}"`,
      );
      fontStyleId = Object.values(fontStyle)[0]; // default to the first defined format
    }
  }

  return { color: allTextColors[colorId], fontStyle: allTextFormats[fontStyleId] };
}
