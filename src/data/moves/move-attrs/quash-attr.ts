import { globalScene } from "#app/global-scene";
import { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { MoveConditionFunc } from "#types/move-types";

export class QuashAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.QUASHED, false, { failOnOverlap: true });
  }

  override getCondition(): MoveConditionFunc | null {
    return (_user, target, _move) => {
      const { turnManager } = globalScene.currentBattle;
      return !target.hasTag(BattlerTagType.QUASHED) && turnManager.findCommandFromPokemon(target) != null;
    };
  }
}
