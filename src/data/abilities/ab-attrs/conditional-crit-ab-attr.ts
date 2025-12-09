import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Guarantees a critical hit according to the given condition, except if target prevents critical hits. ie. Merciless
 * @see {@linkcode apply}
 */
export class ConditionalCritAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ConditionalCritAbAttr";
  private readonly condition: PokemonAttackCondition;

  constructor(condition: PokemonAttackCondition) {
    super();

    this.condition = condition;
  }

  /**
   * @param pokemon {@linkcode Pokemon} user.
   * @param isCritical {@linkcode BooleanHolder} Set to `true` if it should be a critical hit.
   * @param target {@linkcode Pokemon} Target.
   * @param move {@linkcode Move} used by ability user.
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    isCritical: ValueHolder<boolean>,
    _target: Pokemon,
    _move: Move,
  ): void {
    isCritical.value = true;
  }

  public override canApply(...[pokemon, , , target, move]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, target, move);
  }
}
