import type { CommonColor, ShadowColor } from "#enums/color";

/**
 * Combination of a {@linkcode CommonColor} and {@linkcode ShadowColor} used for text elements.
 */
export interface TextColorCombination {
  readonly mainColor: CommonColor;
  readonly shadowColor: ShadowColor;
}
