import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { Moves } from "#enums/moves";
import { AbAttr } from "./ab-attr";

/**
 * Modifies moves additional effects with multipliers, ie. Sheer Force, Serene Grace.
 * @extends AbAttr
 * @see {@linkcode apply}
 */
export class MoveEffectChanceMultiplierAbAttr extends AbAttr {
  private chanceMultiplier: number;

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
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const moveChance: NumberHolder = args[0];
    const move: Move = args[1];
    // const target: Pokemon = args[2];
    // const selfEffect: boolean = args[3];
    const showAbility: boolean = args[4];

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
