import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import { type Move } from "#app/data/move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Attribute to apply a battler tag to the target if they have had their stats boosted this turn.
 * @extends AddBattlerTagAttr
 */
export class AddBattlerTagIfBoostedAttr extends AddBattlerTagAttr {
  constructor(tag: BattlerTagType) {
    super(tag, false, { turnCountMin: 2, turnCountMax: 5 });
  }

  /**
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns true
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (target.turnData.statStagesIncreased) {
      super.apply(user, target, move);
    }
    return true;
  }
}
