import type { AbilityId } from "#enums/ability-id";
import type { BerryType } from "#enums/berry-type";

/** Container for Pokemon-specific data that resets at the end of each wave. */
export interface PokemonWaveData {
  /** How many hits the Pokemon has taken */
  hitCount: number;
  /** The berries eaten by the Pokemon */
  berriesEaten: BerryType[];
  /** The abilities this Pokemon has applied */
  abilitiesApplied: AbilityId[];
  /**
   * The abilities revealed from this Pokemon.
   * This differs from {@linkcode abilitiesApplied} in that
   * effects such as Frisk and Trace can reveal abilities
   * without applying them.
   */
  abilitiesRevealed: AbilityId[];
}
