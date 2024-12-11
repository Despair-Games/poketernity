import { Moves } from "#app/enums/moves";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type Move from "../move";
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
   *             [1]: {@linkcode Moves } Move used by the ability user.
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    // Disable showAbility during getTargetBenefitScore
    this.showAbility = args[4];

    const exceptMoves = [Moves.ORDER_UP, Moves.ELECTRO_SHOT];
    if ((args[0] as NumberHolder).value <= 0 || exceptMoves.includes((args[1] as Move).id)) {
      return false;
    }

    (args[0] as NumberHolder).value *= this.chanceMultiplier;
    (args[0] as NumberHolder).value = Math.min((args[0] as NumberHolder).value, 100);
    return true;
  }
}
