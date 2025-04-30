import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AddBattlerTagAttr } from "#app/data/moves/move-attrs/add-battler-tag-attr";
import { globalScene } from "#app/global-scene";
import { isNil } from "#app/utils/common-utils";
import { BattlerTagType } from "#enums/battler-tag-type";

export class QuashAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.QUASHED, false, { failOnOverlap: true });
  }

  override getCondition(): MoveConditionFunc | null {
    return (_user, target, _move) => {
      const { turnManager } = globalScene.currentBattle;
      return !target.getTag(BattlerTagType.QUASHED) && !isNil(turnManager.findCommandFromPokemon(target));
    };
  }
}
