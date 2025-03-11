import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

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
  override apply(
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
