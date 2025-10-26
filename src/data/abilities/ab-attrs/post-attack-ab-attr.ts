import { AbAttr } from "#abilities/ab-attr";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export abstract class PostAttackAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostAttackAbAttr";
  /** Whether it only applies to attack moves. */
  private readonly attackMovesOnly: boolean;

  constructor(attackMovesOnly: boolean = true, showAbility: boolean = true) {
    super(showAbility);

    this.attackMovesOnly = attackMovesOnly;
  }

  /**
   * Applies an effect after attacking with the given move.
   * Subclasses should override {@linkcode applyPostAttack} instead of this function.
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @param defender - The {@linkcode Pokemon} attacked by the source
   * @param move - The {@linkcode Move} being used
   * @param args - Additional arguments for subclasses
   */
  public abstract override apply(
    pokemon: Pokemon,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    ...args: unknown[]
  ): void;

  public override canApply(...[pokemon, , defender, move]: Parameters<this["apply"]>): boolean {
    return !this.attackMovesOnly || pokemon.getMoveCategory(defender, move) !== MoveCategory.STATUS;
  }
}
