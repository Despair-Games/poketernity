import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/pokemon-attack-condition";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Guarantees a critical hit according to the given condition, except if target prevents critical hits. ie. Merciless
 * @extends AbAttr
 * @see {@linkcode apply}
 */
export class ConditionalCritAbAttr extends AbAttr {
  private readonly condition: PokemonAttackCondition;

  constructor(condition: PokemonAttackCondition) {
    super();
    this._flags.add(AbAttrFlag.CONDITIONAL_CRIT);

    this.condition = condition;
  }

  /**
   * @param pokemon {@linkcode Pokemon} user.
   * @param isCritical {@linkcode BooleanHolder} Set to `true` if it should be a critical hit.
   * @param target {@linkcode Pokemon} Target.
   * @param move {@linkcode Move} used by ability user.
   */
  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    isCritical: BooleanHolder,
    target: Pokemon,
    move: Move,
  ): boolean {
    if (!this.condition(pokemon, target, move)) {
      return false;
    }

    isCritical.value = true;
    return true;
  }
}
