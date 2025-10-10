import type { ObjectValues } from "#types/utility-types";

export const MoveTarget = {
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_the_user Moves that target the User} */
  USER: 1,
  OTHER: 2,
  ALL_OTHERS: 3,
  NEAR_OTHER: 4,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_all_adjacent_Pok%C3%A9mon Moves that target all adjacent Pokemon} */
  ALL_NEAR_OTHERS: 5,
  NEAR_ENEMY: 6,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_all_adjacent_foes Moves that target all adjacent foes} */
  ALL_NEAR_ENEMIES: 7,
  RANDOM_NEAR_ENEMY: 8,
  ALL_ENEMIES: 9,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Counterattacks Counterattacks} */
  ATTACKER: 10,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_one_adjacent_ally Moves that target one adjacent ally} */
  NEAR_ALLY: 11,
  ALLY: 12,
  USER_OR_NEAR_ALLY: 13,
  USER_AND_ALLIES: 14,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_all_Pok%C3%A9mon Moves that target all Pokemon} */
  ALL: 15,
  USER_SIDE: 16,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Entry_hazard-creating_moves Entry hazard-creating moves} */
  ENEMY_SIDE: 17,
  BOTH_SIDES: 18,
  PARTY: 19,
  CURSE: 20,
  DRAGON_DARTS: 21,
} as const;

export type MoveTarget = ObjectValues<typeof MoveTarget>;
