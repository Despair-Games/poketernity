import type { Move } from "#app/data/move";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostAttackAbAttr extends AbAttr {
  /** Whether it only applies to attack moves. */
  private readonly attackMovesOnly: boolean;

  constructor(attackMovesOnly: boolean = true, showAbility: boolean = true) {
    super(showAbility);

    this.attackMovesOnly = attackMovesOnly;
  }

  /**
   * Applies an effect after attacking with the given move.
   * Subclasses should override {@linkcode applyPostAttack} instead of this function.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param defender The {@linkcode Pokemon} attacked by the source
   * @param move The {@linkcode Move} being used
   * @param args Additional arguments for subclasses
   * @returns `true` if effects from this ability can apply successfully.
   */
  override apply(pokemon: Pokemon, simulated: boolean, defender: Pokemon, move: Move, ...args: unknown[]): boolean {
    if (!this.attackMovesOnly || pokemon.getMoveCategory(defender, move) !== MoveCategory.STATUS) {
      return this.applyPostAttack(pokemon, simulated, defender, move, ...args);
    }
    return false;
  }

  /**
   * Called by {@linkcode apply} after a move category check satisfies
   * the attribute's {@linkcode attackOnly} condition to apply effects.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param defender The {@linkcode Pokemon} attacked by the source
   * @param move The {@linkcode Move} being used
   * @param args Additional arguments for subclasses
   * @returns `true` if effects apply successfully
   */
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
