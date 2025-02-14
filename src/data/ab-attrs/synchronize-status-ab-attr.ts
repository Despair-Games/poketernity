import type { Pokemon } from "#app/field/pokemon";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon,
 * that Pokemon receives the same non-volatile status condition as part of this
 * ability attribute.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Synchronize_(Ability) | Synchronize}.
 * @extends AbAttr
 */
export class SynchronizeStatusAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.SYNCHRONIZE_STATUS);
  }

  /**
   * When afflicted with burn, paralysis, or poison, copies the status
   * effect onto the source of the status condition
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param sourcePokemon The {@linkcode Pokemon} applying the status effect
   * @param effect The {@linkcode StatusEffect} being applied
   * @returns `true` if this effect attempts to copy the status effect
   * onto the source.
   */
  override apply(pokemon: Pokemon, simulated: boolean, sourcePokemon: Pokemon, effect: StatusEffect): boolean {
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
