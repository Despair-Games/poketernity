import { AbAttr } from "#abilities/ab-attr";
import { MoveId } from "#enums/move-id";
import type { MoveEffectChanceMultiplierAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Secondary effect chance multipliers do not apply to these moves
 * even though they are implemented with 100 base chance.
 */
const exceptMoves = Object.freeze<MoveId[]>([MoveId.ORDER_UP, MoveId.ELECTRO_SHOT]);

/** Modifies moves additional effects with multipliers, such as Sheer Force and Serene Grace. */
export class MoveEffectChanceMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "MoveEffectChanceMultiplierAbAttr";

  private readonly chanceMultiplier: number;

  constructor(chanceMultiplier: number) {
    super();

    this.chanceMultiplier = chanceMultiplier;
  }

  public override apply({ moveChance }: MoveEffectChanceMultiplierAbAttrParams): void {
    moveChance.value = Math.min(moveChance.value * this.chanceMultiplier, 100);
  }

  public override canApply({ moveChance, move }: Parameters<this["apply"]>[0]): boolean {
    return moveChance.value > 0 && !exceptMoves.includes(move.id);
  }
}
