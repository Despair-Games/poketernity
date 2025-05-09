import { globalScene } from "#app/global-scene";
import { isNil } from "#app/utils/common-utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

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
