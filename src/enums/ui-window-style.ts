import type { EnumValues } from "#types/utility-types";

// Starting the values at `1` breaks things
export const UiWindowStyle = {
  /** #c73625 */
  RED_ORANGE: 0,
  /** #20B098 */
  TEAL: 1,
  /** #d7d7d7 */
  LIGHT_GRAY: 2,
  /**
   * Also known as vivid orange-yellow \
   * #ffb745
   */
  GOLDENROD: 3,
  /** #b2b2b2 */
  MEDIUM_GRAY: 4,
} as const;

export type UiWindowStyle = EnumValues<typeof UiWindowStyle>;
