import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
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

    this.condition = condition;
  }

  /**
   * @param pokemon {@linkcode Pokemon} user.
   * @param args -
   * - [0] {@linkcode BooleanHolder} Set to `true` if it should be a critical hit.
   * - [1] {@linkcode Pokemon} Target.
   * - [2] {@linkcode Move} used by ability user.
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const isCritical: BooleanHolder = args[0];
    const target: Pokemon = args[1];
    const move: Move = args[2];
    if (!this.condition(pokemon, target, move)) {
      return false;
    }

    isCritical.value = true;
    return true;
  }
}
