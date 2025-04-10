// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TrainerType } from "#enums/trainer-type";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { DefenseCalculationContext } from "#app/data/items/base-item";
import { Badge } from "#app/data/items/key-items/badge";
import { ItemId } from "#enums/item-id";

/**
 * The badge for beating {@linkcode TrainerType.BROCK Brock}.
 * Applies a 5% boost to all Pokemons defense.
 * TODO: The badges effect was never officially decided and only serves as an example for now!
 */
export class BoulderBadge extends Badge {
  /** The defense boost provided by the badge */
  public static readonly DEFENSE_MULTIPLIER = 1.05;

  constructor() {
    super({ id: ItemId.BOULDER_BADGE });
  }

  /**
   * Apply a 5% boost to all Pokemons defense
   * @param context The {@linkcode DefenseCalculationContext}
   * @override
   */
  public override onDefenseCalulation(context: DefenseCalculationContext): void {
    context.multiplier.value *= BoulderBadge.DEFENSE_MULTIPLIER;
  }
}
