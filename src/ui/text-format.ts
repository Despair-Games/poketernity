import { TextFormat } from "#enums/text-format";
import type { TextFormatOptions } from "#app/ui/interfaces/text-format-options";

/**
 * Object linking each {@linkcode TextFormat} to a {@linkcode TextFormatOptions}.
 */
export const allTextFormats: Record<TextFormat, TextFormatOptions> = {
  [TextFormat.DEFAULT_FONT_96PX]: {
    fontFamily: "emerald",
    fontSize: 96,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_96PX_BIG_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 96,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [TextFormat.DEFAULT_FONT_84PX_BIG_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 84,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [TextFormat.DEFAULT_FONT_80PX]: {
    fontFamily: "emerald",
    fontSize: 80,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_72PX]: {
    fontFamily: "emerald",
    fontSize: 72,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_72PX_MEDIUM_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 72,
    shadow: { xPosition: 3.5, yPosition: 3.5 }, // why 3.5
  },
  [TextFormat.DEFAULT_FONT_64PX]: {
    fontFamily: "emerald",
    fontSize: 64,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_60PX]: {
    fontFamily: "emerald",
    fontSize: 60,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_56PX]: {
    fontFamily: "emerald",
    fontSize: 56,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_54PX]: {
    fontFamily: "emerald",
    fontSize: 54,
    shadow: { xPosition: 3, yPosition: 3 },
  },

  [TextFormat.ALT_FONT_66PX]: {
    fontFamily: "pkmnems",
    fontSize: 66,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [TextFormat.ALT_FONT_54PX]: {
    fontFamily: "pkmnems",
    fontSize: 54,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [TextFormat.ALT_FONT_54PX_STROKE]: {
    fontFamily: "pkmnems",
    fontSize: 54,
    strokeThickness: 14,
  },
  [TextFormat.ALT_FONT_44PX_STROKE]: {
    fontFamily: "pkmnems",
    fontSize: 44,
    strokeThickness: 14,
  },
};
