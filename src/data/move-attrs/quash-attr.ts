import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AddBattlerTagAttr } from "#app/data/move-attrs/add-battler-tag-attr";
import { globalScene } from "#app/global-scene";
import { isNullOrUndefined } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";

export class QuashAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.QUASHED, false, { failOnOverlap: true });
  }

  override getCondition(): MoveConditionFunc | null {
    return (_user, target, _move) => {
      const { turnManager } = globalScene.currentBattle;
      return !target.getTag(BattlerTagType.QUASHED) && !isNullOrUndefined(turnManager.findCommandFromPokemon(target));
    };
  }
}
