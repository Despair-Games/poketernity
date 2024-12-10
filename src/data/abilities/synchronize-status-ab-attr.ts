import type Pokemon from "#app/field/pokemon";
import { StatusEffect } from "#enums/status-effect";
import { PostSetStatusAbAttr } from "./post-set-status-ab-attr";

/**
 * If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon,
 * that Pokemon receives the same non-volatile status condition as part of this
 * ability attribute. For Synchronize ability.
 */
export class SynchronizeStatusAbAttr extends PostSetStatusAbAttr {
  /**
   * If the `StatusEffect` that was set is Burn, Paralysis, Poison, or Toxic, and the status
   * was set by a source Pokemon, set the source Pokemon's status to the same `StatusEffect`.
   * @param pokemon {@linkcode Pokemon} that status condition was set on.
   * @param sourcePokemon {@linkcode Pokemon} that that set the status condition. Is null if status was not set by a Pokemon.
   * @param _passive Whether this ability is a passive.
   * @param effect {@linkcode StatusEffect} that was set.
   * @param _args Set of unique arguments needed by this attribute.
   * @returns `true` if application of the ability succeeds.
   */
  override applyPostSetStatus(
    pokemon: Pokemon,
    sourcePokemon: Pokemon | null = null,
    _passive: boolean,
    effect: StatusEffect,
    simulated: boolean,
    _args: any[],
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
