import { EggTier } from "#enums/egg-type";
import type Phaser from "phaser";
import type BBCodeText from "phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText";
import type InputText from "phaser3-rex-plugins/plugins/inputtext";
import { globalScene } from "#app/global-scene";
import { ModifierTier } from "#enums/modifier-tier";
import { TextStyle } from "#enums/text-style";
import { getTextStyle } from "./text-style";
import { TEXT_SCALE } from "#app/ui-constants";

interface CustomTextStyleOptions {
  scale: number;
  styleOptions: Phaser.Types.GameObjects.Text.TextStyle | InputText.IConfig;
  shadowColor: string;
  shadow?: {
    xPosition: number;
    yPosition: number;
  };
  strokeThickness?: number;
}

export function addTextObject(
  x: number,
  y: number,
  content: string,
  style: TextStyle,
  extraStyleOptions?: Phaser.Types.GameObjects.Text.TextStyle,
): Phaser.GameObjects.Text {
  const { scale, styleOptions, shadowColor, shadow, strokeThickness } = getTextStyleOptions(style, extraStyleOptions);

  const ret = globalScene.add.text(x, y, content, styleOptions);
  ret.setScale(scale);
  if (shadow) {
    ret.setShadow(shadow.xPosition, shadow.yPosition, shadowColor);
  } else if (strokeThickness) {
    ret.setStroke(shadowColor, strokeThickness);
  }
  if (!(styleOptions as Phaser.Types.GameObjects.Text.TextStyle).lineSpacing) {
    ret.setLineSpacing(scale * 30); // Todo: check this value
  }
  return ret;
}

export function addBBCodeTextObject(
  x: number,
  y: number,
  content: string,
  style: TextStyle,
  extraStyleOptions?: Phaser.Types.GameObjects.Text.TextStyle,
): BBCodeText {
  const { scale, styleOptions, shadowColor, shadow, strokeThickness } = getTextStyleOptions(style, extraStyleOptions);

  const ret = globalScene.add.rexBBCodeText(x, y, content, styleOptions as BBCodeText.TextStyle);
  ret.setScale(scale);
  if (shadow) {
    ret.setShadow(shadow.xPosition, shadow.yPosition, shadowColor);
  } else if (strokeThickness) {
    ret.setStroke(shadowColor, strokeThickness);
  }
  if (!(styleOptions as BBCodeText.TextStyle).lineSpacing) {
    ret.setLineSpacing(scale * 60); // Todo: check this value
  }
  return ret;
}

export function addTextInputObject(
  x: number,
  y: number,
  width: number,
  height: number,
  style: TextStyle,
  extraStyleOptions?: InputText.IConfig,
): InputText {
  const { scale, styleOptions } = getTextStyleOptions(style, extraStyleOptions);

  const ret = globalScene.add.rexInputText(x, y, width, height, styleOptions as InputText.IConfig);
  ret.setScale(scale);

  return ret;
}

/**
 * Set the color and shadow color of a Text object based on the given TextStyle.
 * @param textObject the {@linkcode Phaser.GameObjects.Text} to update.
 * @param style the {@linkcode TextStyle} to use.
 */
export function setTextColor(textObject: Phaser.GameObjects.Text, style: TextStyle): void {
  const {
    color: { mainColor, shadowColor },
    fontStyle: { shadow, strokeThickness },
  } = getTextStyle(style);
  textObject.setColor(mainColor);
  if (shadow) {
    textObject.setShadowColor(shadowColor);
  }
  if (strokeThickness) {
    textObject.setStroke(shadowColor, strokeThickness);
  }
}

function getTextStyleOptions(
  style: TextStyle,
  extraStyleOptions?: Phaser.Types.GameObjects.Text.TextStyle,
): CustomTextStyleOptions {
  const textStyleOptions = getTextStyle(style);
  const { mainColor, shadowColor } = textStyleOptions.color;
  const { fontFamily, fontSize, shadow, strokeThickness } = textStyleOptions.fontStyle;

  let styleOptions: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: fontFamily,
    fontSize: fontSize,
    color: mainColor,
    padding: {
      bottom: 6,
    },
  };

  if (extraStyleOptions) {
    if (extraStyleOptions.fontSize) {
      // We should not define custom font sizes
      showTextStyleOptionWarning("font size", extraStyleOptions.fontSize);
    }
    styleOptions = Object.assign(styleOptions, extraStyleOptions);
  }

  /** Needed for the text to look crisp with the current font, see {@linkcode TEXT_SCALE} */
  const scale = 1 / TEXT_SCALE;

  if (shadow) {
    return { scale, styleOptions, shadowColor, shadow };
  }
  return { scale, styleOptions, shadowColor, strokeThickness };
}

function showTextStyleOptionWarning(option: string, value: any) {
  console.warn(
    `A Text Object is using a custom ${option} of value ${value}`,
    "Only specific values defined in the FontStyle enum should be used to preserve the characters readibility.",
    "Either use an existing TextStyle, or create a new one that makes use of one of the existing FontStyles.",
  );
}

export function getBBCodeFragment(
  content: string,
  textStyle: TextStyle,
  closeFragment: boolean = false,
  noShadow = false,
): string {
  const { mainColor, shadowColor } = getTextStyle(textStyle).color;
  let openingFragment = `[color=${mainColor}]`;
  let closingFragment = closeFragment ? "[/color]" : "";
  if (!noShadow) {
    openingFragment += `[shadow=${shadowColor}]`;
    if (closeFragment) {
      closingFragment = "[/shadow]" + closingFragment;
    }
  }
  return `${openingFragment}${content}${closingFragment}`;
}

/**
 * Should only be used with BBCodeText (see {@linkcode addBBCodeTextObject()})
 * This does NOT work with UI showText() or showDialogue() methods.
 * Method will do pattern match/replace and apply BBCode color/shadow styling to substrings within the content:
 * @[<TextStyle>]{<text to color>}
 *
 * Example: passing a content string of "@[SUMMARY_BLUE]{blue text} primaryStyle text @[SUMMARY_RED]{red text}" will result in:
 * - "blue text" with TextStyle.SUMMARY_BLUE applied
 * - " primaryStyle text " with primaryStyle TextStyle applied
 * - "red text" with TextStyle.SUMMARY_RED applied
 * @param content string with styling that need to be applied for BBCodeTextObject
 * @param primaryStyle Primary style is required in order to escape BBCode styling properly.
 * @param forWindow set to `true` if the text is to be displayed in a window ({@linkcode BattleScene.addWindow})
 *  it will replace all instances of the default MONEY TextStyle by {@linkcode TextStyle.MONEY_WINDOW}
 */
export function getTextWithColors(content: string, primaryStyle: TextStyle, forWindow?: boolean): string {
  // Apply primary styling before anything else
  let text = getBBCodeFragment(content, primaryStyle, true);
  const primaryStyleString = [...text.match(new RegExp(/\[color=[^\[]*\]\[shadow=[^\[]*\]/i))!][0];

  /* For money text displayed in game windows, we can't use the default {@linkcode TextStyle.MONEY}
   * or it will look wrong in light mode because of the different window background color
   * So, for text to be displayed in windows replace all "@[MONEY]" with "@[MONEY_WINDOW]" */
  if (forWindow) {
    text = text.replace(/@\[MONEY\]/g, (_substring: string) => "@[MONEY_WINDOW]");
  }

  // Set custom colors
  text = text.replace(/@\[([^{]*)\]{([^}]*)}/gi, (_substring, textStyle: string, textToColor: string) => {
    return "[/color][/shadow]" + getBBCodeFragment(textToColor, TextStyle[textStyle], true) + primaryStyleString;
  });

  // Remove extra style block at the end
  return text.replace(/\[color=[^\[]*\]\[shadow=[^\[]*\]\[\/color\]\[\/shadow\]/gi, "");
}

export function getModifierTierTextTint(tier: ModifierTier): number {
  switch (tier) {
    case ModifierTier.COMMON:
      return 0xf8f8f8;
    case ModifierTier.GREAT:
      return 0x4998f8;
    case ModifierTier.ULTRA:
      return 0xf8d038;
    case ModifierTier.EPIC:
      return 0xdb4343;
    case ModifierTier.MASTER:
      return 0xe331c5;
    case ModifierTier.LUXURY:
      return 0xe74c18;
  }
}

export function getEggTierTextTint(tier: EggTier): number {
  switch (tier) {
    case EggTier.COMMON:
      return getModifierTierTextTint(ModifierTier.COMMON);
    case EggTier.RARE:
      return getModifierTierTextTint(ModifierTier.GREAT);
    case EggTier.EPIC:
      return getModifierTierTextTint(ModifierTier.ULTRA);
    case EggTier.LEGENDARY:
      return getModifierTierTextTint(ModifierTier.MASTER);
  }
}
