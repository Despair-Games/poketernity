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
      return "#40c8f8"; // light blue
    case Gender.FEMALE:
      return "#f89890"; // pink
  }
  return "#ffffff"; // White
}

/**
 * Gets a color for a gender shadow
 * @param gender - The {@linkcode Gender}
 * @returns a hex representation of color
 */
export function getGenderShadowColor(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return "#006090"; // Dark blue
    case Gender.FEMALE:
      return "#984038"; // Red
  }
  return "#ffffff"; // White
}
