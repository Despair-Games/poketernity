import { TextFormat } from "#enums/text-format";
import type { TextFormatOptions } from "#app/ui/interfaces/text-format-options";

/**
 * Object linking each {@linkcode TextFormat} to a {@linkcode TextFormatOptions}.
 */
export const allTextFormats: Record<TextFormat, TextFormatOptions> = {
  [TextFormat.DEFAULT_FONT_128PX]: {
    fontFamily: "emerald",
    fontSize: 128,
    shadow: { xPosition: 3, yPosition: 3 },
  },
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
  [TextFormat.DEFAULT_FONT_76PX]: {
    fontFamily: "emerald",
    fontSize: 76,
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
  [TextFormat.DEFAULT_FONT_52PX]: {
    fontFamily: "emerald",
    fontSize: 52,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_48PX]: {
    fontFamily: "emerald",
    fontSize: 48,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.DEFAULT_FONT_42PX]: {
    fontFamily: "emerald",
    fontSize: 42,
    shadow: { xPosition: 2, yPosition: 2 },
  },
  [TextFormat.DEFAULT_FONT_36PX]: {
    fontFamily: "emerald",
    fontSize: 36,
    shadow: { xPosition: 2, yPosition: 2 },
  },
  [TextFormat.DEFAULT_FONT_32PX]: {
    fontFamily: "emerald",
    fontSize: 32,
    shadow: { xPosition: 2, yPosition: 2 },
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
  [TextFormat.ALT_FONT_38PX]: {
    fontFamily: "pkmnems",
    fontSize: 38,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [TextFormat.ALT_FONT_35PX]: {
    fontFamily: "pkmnems",
    fontSize: 35,
    shadow: { xPosition: 3, yPosition: 3 },
  },
};
