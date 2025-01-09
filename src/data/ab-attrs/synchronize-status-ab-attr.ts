import type { Pokemon } from "#app/field/pokemon";
import { StatusEffect } from "#enums/status-effect";
import { PostSetStatusAbAttr } from "./post-set-status-ab-attr";

/**
 * If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon,
 * that Pokemon receives the same non-volatile status condition as part of this
 * ability attribute. For Synchronize ability.
 * @extends PostSetStatusAbAttr
 */
export class SynchronizeStatusAbAttr extends PostSetStatusAbAttr {
  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    sourcePokemon: Pokemon | null = null,
    effect: StatusEffect,
  ): boolean {
    /** Synchronizable statuses */
    const syncStatuses = new Set<StatusEffect>([
      StatusEffect.BURN,
      StatusEffect.PARALYSIS,
      StatusEffect.POISON,
      StatusEffect.TOXIC,
    ]);

    if (sourcePokemon && syncStatuses.has(effect)) {
      if (!simulated) {
        sourcePokemon.trySetStatus(effect, true, pokemon);
      }
      return true;
    }

    return false;
  }
}
