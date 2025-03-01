import { TextFormat } from "#enums/text-format";
import type { TextFormatOptions } from "#app/ui/interfaces/text-format-options";

/**
 * Object linking each {@linkcode TextFormat} to a {@linkcode TextFormatOptions}.
 */
export const allTextFormats: Record<TextFormat, TextFormatOptions> = {
  [TextFormat.DEFAULT_FONT_96PX]: {
    fontFamily: "emerald",
    fontSize: 96,
    shadowXpos: 3,
    shadowYpos: 3,
  },
  [TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 96,
    shadowXpos: 4,
    shadowYpos: 5,
  },
  [TextFormat.DEFAULT_FONT_84PX_BIG_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 84,
    shadowXpos: 4,
    shadowYpos: 5,
  },
  [TextFormat.DEFAULT_FONT_80PX]: {
    fontFamily: "emerald",
    fontSize: 80,
    shadowXpos: 3,
    shadowYpos: 3,
  },
  [TextFormat.DEFAULT_FONT_72PX]: {
    fontFamily: "emerald",
    fontSize: 72,
    shadowXpos: 3,
    shadowYpos: 3,
  },
  [TextFormat.DEFAULT_FONT_72PX_MEDIUM_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 72,
    shadowXpos: 3.5, // why
    shadowYpos: 3.5,
  },
  [TextFormat.DEFAULT_FONT_64PX]: {
    fontFamily: "emerald",
    fontSize: 64,
    shadowXpos: 3,
    shadowYpos: 3,
  },
  [TextFormat.DEFAULT_FONT_60PX]: {
    fontFamily: "emerald",
    fontSize: 60,
    shadowXpos: 3,
    shadowYpos: 3,
  },
  [TextFormat.DEFAULT_FONT_56PX]: {
    fontFamily: "emerald",
    fontSize: 56,
    shadowXpos: 3,
    shadowYpos: 3,
  },
  [TextFormat.DEFAULT_FONT_54PX]: {
    fontFamily: "emerald",
    fontSize: 54,
    shadowXpos: 3,
    shadowYpos: 3,
  },

  [TextFormat.ALT_FONT_66PX]: {
    fontFamily: "pkmnems",
    fontSize: 66,
    shadowXpos: 4,
    shadowYpos: 5,
  },
  [TextFormat.ALT_FONT_54PX]: {
    fontFamily: "pkmnems",
    fontSize: 54,
    shadowXpos: 4,
    shadowYpos: 5,
  },
};
