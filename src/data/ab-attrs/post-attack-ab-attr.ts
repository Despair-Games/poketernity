import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { MoveCategory } from "#enums/move-category";
import { AbAttr } from "./ab-attr";

export class PostAttackAbAttr extends AbAttr {
  /** Does this effect only apply to attack moves? */
  private readonly attackOnly: boolean;

  constructor(attackOnly: boolean = true, showAbility: boolean = true) {
    super(showAbility);

    this.attackOnly = attackOnly;
  }

  /**
   * Applies an effect after attacking with the given move.
   * Subclasses should override {@linkcode applyPostAttack} instead of this function.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param defender The {@linkcode Pokemon} attacked by the source
   * @param move The {@linkcode Move} being used
   * @param args Additional arguments for subclasses
   * @returns `true` if effects from this ability can apply successfully.
   */
  override apply(pokemon: Pokemon, simulated: boolean, defender: Pokemon, move: Move, ...args: unknown[]): boolean {
    if (!this.attackOnly || pokemon.getMoveCategory(defender, move) !== MoveCategory.STATUS) {
      return this.applyPostAttack(pokemon, simulated, defender, move, ...args);
    }
    return false;
  }

  protected applyPostAttack(
    _pokemon: Pokemon,
    _simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
