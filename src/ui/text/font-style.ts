import { FontStyle } from "#enums/font-style";
import type { FontStyleOptions } from "#app/ui/interfaces/font-style-options";

/**
 * Object linking each {@linkcode FontStyle} to {@linkcode FontStyleOptions}.
 */
export const allTextFormats: Record<FontStyle, FontStyleOptions> = {
  [FontStyle.DEFAULT_FONT_128PX]: {
    fontFamily: "emerald",
    fontSize: 128,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_96PX]: {
    fontFamily: "emerald",
    fontSize: 96,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_96PX_BIG_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 96,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [FontStyle.DEFAULT_FONT_84PX_BIG_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 84,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [FontStyle.DEFAULT_FONT_80PX]: {
    fontFamily: "emerald",
    fontSize: 80,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_76PX]: {
    fontFamily: "emerald",
    fontSize: 76,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_72PX]: {
    fontFamily: "emerald",
    fontSize: 72,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_72PX_MEDIUM_SHADOW]: {
    fontFamily: "emerald",
    fontSize: 72,
    shadow: { xPosition: 3.5, yPosition: 3.5 }, // why 3.5
  },
  [FontStyle.DEFAULT_FONT_64PX]: {
    fontFamily: "emerald",
    fontSize: 64,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_60PX]: {
    fontFamily: "emerald",
    fontSize: 60,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_56PX]: {
    fontFamily: "emerald",
    fontSize: 56,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_54PX]: {
    fontFamily: "emerald",
    fontSize: 54,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_50PX]: {
    fontFamily: "emerald",
    fontSize: 50,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_52PX]: {
    fontFamily: "emerald",
    fontSize: 52,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_48PX]: {
    fontFamily: "emerald",
    fontSize: 48,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.DEFAULT_FONT_44PX]: {
    fontFamily: "emerald",
    fontSize: 44,
    shadow: { xPosition: 2, yPosition: 2 },
  },
  [FontStyle.DEFAULT_FONT_42PX]: {
    fontFamily: "emerald",
    fontSize: 42,
    shadow: { xPosition: 2, yPosition: 2 },
  },
  [FontStyle.DEFAULT_FONT_40PX]: {
    fontFamily: "emerald",
    fontSize: 40,
    shadow: { xPosition: 2, yPosition: 2 },
  },
  [FontStyle.DEFAULT_FONT_36PX]: {
    fontFamily: "emerald",
    fontSize: 36,
    shadow: { xPosition: 2, yPosition: 2 },
  },
  [FontStyle.DEFAULT_FONT_34PX]: {
    fontFamily: "emerald",
    fontSize: 34,
    shadow: { xPosition: 2, yPosition: 2 },
  },
  [FontStyle.DEFAULT_FONT_32PX]: {
    fontFamily: "emerald",
    fontSize: 32,
    shadow: { xPosition: 2, yPosition: 2 },
  },

  [FontStyle.ALT_FONT_66PX]: {
    fontFamily: "pkmnems",
    fontSize: 66,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [FontStyle.ALT_FONT_66PX_STROKE]: {
    fontFamily: "pkmnems",
    fontSize: 66,
    strokeThickness: 16,
  },
  [FontStyle.ALT_FONT_54PX]: {
    fontFamily: "pkmnems",
    fontSize: 54,
    shadow: { xPosition: 4, yPosition: 5 },
  },
  [FontStyle.ALT_FONT_54PX_STROKE]: {
    fontFamily: "pkmnems",
    fontSize: 54,
    strokeThickness: 14,
  },
  [FontStyle.ALT_FONT_44PX_STROKE]: {
    fontFamily: "pkmnems",
    fontSize: 44,
    strokeThickness: 14,
  },
  [FontStyle.ALT_FONT_38PX]: {
    fontFamily: "pkmnems",
    fontSize: 38,
    shadow: { xPosition: 3, yPosition: 3 },
  },
  [FontStyle.ALT_FONT_35PX]: {
    fontFamily: "pkmnems",
    fontSize: 35,
    shadow: { xPosition: 3, yPosition: 3 },
  },
};
