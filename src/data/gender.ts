import { Gender } from "#enums/gender";
import { TextStyle } from "#enums/text-style";

/**
 * Gets the gender symbol for an associated gender
 * @param gender The {@linkcode Gender} being checked
 * @returns The associated symbol
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
 * Gets the {@linkcode TextStyle} for an associated gender
 * @param gender The {@linkcode Gender} being checked
 * @returns The associated text style
 */
export function getGenderTextStyle(gender: Gender): TextStyle {
  switch (gender) {
    case Gender.MALE:
      return TextStyle.GENDER_MALE;
    case Gender.FEMALE:
      return TextStyle.GENDER_FEMALE;
  }
  return TextStyle.SUMMARY;
}
