import type { ObjectValues } from "#types/utility-types";

/**
 * Determines the selected battle style.
 * - 'Switch' - The option to switch the active pokemon at the start of a battle will be displayed.
 * - 'Set' - The option to switch the active pokemon at the start of a battle will not display.
 */
export const BattleStyle = {
  SWITCH: 1,
  SET: 2,
} as const;

export type BattleStyle = ObjectValues<typeof BattleStyle>;
