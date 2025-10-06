import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Secondary effect chance multipliers do not apply to these moves
 * even though they are implemented with 100 base chance.
 */
const exceptMoves = Object.freeze<MoveId[]>([MoveId.ORDER_UP, MoveId.ELECTRO_SHOT]);

/**
 * Modifies moves additional effects with multipliers, ie. Sheer Force, Serene Grace.
 * @see {@linkcode apply}
 */
export class MoveEffectChanceMultiplierAbAttr extends AbAttr {
  private readonly chanceMultiplier: number;

  constructor(chanceMultiplier: number) {
    super();
    this._flags.add(AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER);
    this.chanceMultiplier = chanceMultiplier;
  }

  /**
   * @param moveChance - {@linkcode NumberHolder} containing the additional effect chance.
   * @param move - The {@linkcode Move} used by the ability holder.
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, moveChance: ValueHolder<number>, _move: Move): void {
    moveChance.value = Math.min(moveChance.value * this.chanceMultiplier, 100);
  }

  public override canApply(...[, , moveChance, move]: Parameters<this["apply"]>): boolean {
    return moveChance.value > 0 && !exceptMoves.includes(move.id);
  }
}
