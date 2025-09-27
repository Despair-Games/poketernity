import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute that boosts a move's recovery by a certain factor if it meets specific conditions
 * Used by abilities like...
 * - Mega Launcher (Recovery move must have a PULSE_MOVE flag)
 */
export class RecoveryBoostAbAttr extends AbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly recoveryMultiplier: number;

  constructor(condition: PokemonAttackCondition, recoveryMultiplier: number) {
    super();
    this._flags.add(AbAttrFlag.RECOVERY_BOOST);
    this.condition = condition;
    this.recoveryMultiplier = recoveryMultiplier;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender: Pokemon,
    healRatio: ValueHolder<number>,
  ): void {
    healRatio.value *= this.recoveryMultiplier;
  }

  public override canApply(...[pokemon, , move, defender]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, defender, move);
  }
}
