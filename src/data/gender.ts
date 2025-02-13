import { CommonColor, ShadowColor } from "#enums/color";
import { Gender } from "#enums/gender";

/**
 * Gets the gender symbol for an associated gender
 * @param gender - The {@linkcode Gender} being checked
 * @returns - The associated symbol
 */
export function getGenderSymbol(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return "♂";
    case Gender.FEMALE:
      return "♀";
  }
  return "";
}

/**
 * Gets a color for a gender
 * @param gender - The {@linkcode Gender}
 * @returns a hex representation of color
 */
export function getGenderColor(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return CommonColor.LIGHT_BLUE;
    case Gender.FEMALE:
      return CommonColor.SOFT_PINK;
  }
  return CommonColor.WHITE;
}

/**
 * Gets a color for a gender shadow
 * @param gender - The {@linkcode Gender}
 * @returns a hex representation of color
 */
export function getGenderShadowColor(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return ShadowColor.LIGHT_BLUE;
    case Gender.FEMALE:
      return ShadowColor.DEEP_RED;
  }
  return CommonColor.WHITE;
}
