import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

/**
 * Ability attribute that boosts a move's recovery by a certain factor if it meets specific conditions
 * Used by abilities like...
 * - Mega Launcher (Recovery move must have a PULSE_MOVE flag)
 */
export class RecoveryBoostAbAttr extends AbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly recoveryMultiplier: number;

  constructor(condition: PokemonAttackCondition, recoveryMultiplier: number, showAbility: boolean = true) {
    super(showAbility);
    this._flags.add(AbAttrFlag.RECOVERY_BOOST);
    this.condition = condition;
    this.recoveryMultiplier = recoveryMultiplier;
  }

  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    defender: Pokemon,
    healRatio: NumberHolder,
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      healRatio.value *= this.recoveryMultiplier;
      return true;
    }
    return false;
  }
}
