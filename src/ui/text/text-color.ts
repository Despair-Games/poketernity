import { ShadowColor, TextColor, CommonColor } from "#enums/color";
import type { TextColorCombination } from "#app/ui/interfaces/text-color-combination";

/**
 * Object linking each {@linkcode TextColor} to a {@linkcode CommonColor} and {@linkcode ShadowColor}.
 */
export const allTextColors: Record<TextColor, TextColorCombination> = Object.freeze({
  [TextColor.WHITE_DARK_PURPLE_SHADOW]: { mainColor: CommonColor.OFF_WHITE, shadowColor: ShadowColor.PURPLE },
  [TextColor.WHITE_GREY_SHADOW]: { mainColor: CommonColor.OFF_WHITE, shadowColor: ShadowColor.GREY },
  [TextColor.WHITE_DARK_GREY_SHADOW]: { mainColor: CommonColor.OFF_WHITE, shadowColor: ShadowColor.DARKER_GREY },
  [TextColor.GREY_DARK_SHADOW]: { mainColor: CommonColor.LIGHT_GREY, shadowColor: ShadowColor.GREY },
  [TextColor.DARK_GREY_LIGHT_SHADOW]: { mainColor: CommonColor.GREY, shadowColor: ShadowColor.LIGHT_GREY },

  [TextColor.PINK_DARK_GREY_SHADOW]: { mainColor: CommonColor.SOFT_PINK, shadowColor: ShadowColor.DARKER_GREY },
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
