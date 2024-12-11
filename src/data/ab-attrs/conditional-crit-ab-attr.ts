import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Guarantees a critical hit according to the given condition, except if target prevents critical hits. ie. Merciless
 * @extends AbAttr
 * @see {@linkcode apply}
 */
export class ConditionalCritAbAttr extends AbAttr {
  private condition: PokemonAttackCondition;

  constructor(condition: PokemonAttackCondition, _checkUser?: Boolean) {
    super();

    this.condition = condition;
  }

  /**
   * @param pokemon {@linkcode Pokemon} user.
   * @param args [0] {@linkcode BooleanHolder} If true critical hit is guaranteed.
   *             [1] {@linkcode Pokemon} Target.
   *             [2] {@linkcode Move} used by ability user.
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const target = args[1] as Pokemon;
    const move = args[2] as Move;
    if (!this.condition(pokemon, target, move)) {
      return false;
    }

    (args[0] as BooleanHolder).value = true;
    return true;
  }
}
