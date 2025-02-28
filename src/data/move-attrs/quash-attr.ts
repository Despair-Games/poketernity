import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AddBattlerTagAttr } from "#app/data/move-attrs/add-battler-tag-attr";
import { BattlerTagType } from "#enums/battler-tag-type";

export class QuashAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.QUASHED, false, { failOnOverlap: true });
  }

  override getCondition(): MoveConditionFunc | null {
    return (_user, target, _move) => !target.getTag(BattlerTagType.QUASHED) && !target.turnData.acted;
  }
}
