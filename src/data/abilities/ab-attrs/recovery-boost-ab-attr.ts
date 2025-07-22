import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { NumberHolder } from "#utils/common-utils";

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

  public override apply(
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
