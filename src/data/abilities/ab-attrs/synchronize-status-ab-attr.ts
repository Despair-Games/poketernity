import { AbAttr } from "#abilities/ab-attr";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";

/** All status effects that can be transferred by Synchronize */
const syncStatuses = Object.freeze<ReadonlySet<StatusEffect>>(
  new Set([StatusEffect.BURN, StatusEffect.PARALYSIS, StatusEffect.POISON, StatusEffect.TOXIC]),
);

/**
 * If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon,
 * that Pokemon receives the same non-volatile status condition as part of this
 * ability attribute.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Synchronize_(Ability) | Synchronize}.
 */
export class SynchronizeStatusAbAttr extends AbAttr {
  protected override readonly abAttrKey = "SynchronizeStatusAbAttr";

  constructor() {
    super(true);
  }

  /**
   * When afflicted with burn, paralysis, or poison, copies the status
   * effect onto the source of the status condition
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @param sourcePokemon - The {@linkcode Pokemon} applying the status effect
   * @param effect - The {@linkcode StatusEffect} being applied
   */
  public override apply(pokemon: Pokemon, simulated: boolean, sourcePokemon: Pokemon, effect: StatusEffect): void {
    if (!simulated) {
      sourcePokemon.trySetStatus(effect, true, pokemon);
    }
  }

  public override canApply(...[, , sourcePokemon, effect]: Parameters<this["apply"]>): boolean {
    // Synchronize is meant to activate even if the status effect cannot be applied to the source,
    // hence `canSetStatus` not being checked here.
    return sourcePokemon != null && syncStatuses.has(effect);
  }
}
