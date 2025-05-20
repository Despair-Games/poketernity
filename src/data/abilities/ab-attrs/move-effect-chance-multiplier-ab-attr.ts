import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Modifies moves additional effects with multipliers, ie. Sheer Force, Serene Grace.
 * @extends AbAttr
 * @see {@linkcode apply}
 */
export class MoveEffectChanceMultiplierAbAttr extends AbAttr {
  private readonly chanceMultiplier: number;

  constructor(chanceMultiplier: number) {
    super(true);
    this._flags.add(AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER);
    this.chanceMultiplier = chanceMultiplier;
  }
  /**
   * @param moveChance - {@linkcode NumberHolder} containing the additional effect chance. Has to be higher than or equal to 0.
   * @param move - {@linkcode Move} used by the ability holder.
   * @param showAbility - Whether to show the ability flyout or not.
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    moveChance: NumberHolder,
    move: Move,
    showAbility: boolean,
  ): boolean {
    this.showAbility = showAbility;

    const exceptMoves = [MoveId.ORDER_UP, MoveId.ELECTRO_SHOT];
    if (moveChance.value <= 0 || exceptMoves.includes(move.id)) {
      return false;
    }

    moveChance.value *= this.chanceMultiplier;
    moveChance.value = Math.min(moveChance.value, 100);
    return true;
  }
}
