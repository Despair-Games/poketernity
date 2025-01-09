import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { Moves } from "#enums/moves";
import { AbAttr } from "./ab-attr";

/**
 * Modifies moves additional effects with multipliers, ie. Sheer Force, Serene Grace.
 * @extends AbAttr
 * @see {@linkcode apply}
 */
export class MoveEffectChanceMultiplierAbAttr extends AbAttr {
  private readonly chanceMultiplier: number;

  constructor(chanceMultiplier: number) {
    super(true);
    this.chanceMultiplier = chanceMultiplier;
  }
  /**
   * @param args [0]: {@linkcode NumberHolder} Move additional effect chance. Has to be higher than or equal to 0.
   *             [1]: {@linkcode Moves} Move used by the ability user.
   *             [4]: Whether to show the ability flyout or not
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    moveChance: NumberHolder,
    move: Move,
    showAbility: boolean,
  ): boolean {
    this.showAbility = showAbility;

    const exceptMoves = [Moves.ORDER_UP, Moves.ELECTRO_SHOT];
    if (moveChance.value <= 0 || exceptMoves.includes(move.id)) {
      return false;
    }

    moveChance.value *= this.chanceMultiplier;
    moveChance.value = Math.min(moveChance.value, 100);
    return true;
  }
}
