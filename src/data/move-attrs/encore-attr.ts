import { AddBattlerTagAttr } from "#app/data/move-attrs/add-battler-tag-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

export class EncoreAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.ENCORE, false, { failOnOverlap: true });
  }

  override getCondition(): MoveConditionFunc | null {
    return (_user, target, _move): boolean => {
      if (target.isMax()) {
        return false;
      }

      const lastMoves = target.getLastXMoves(1);
      if (!lastMoves.length) {
        return false;
      }

      const repeatableMove = lastMoves[0];

      if (!repeatableMove.move.id || repeatableMove.virtual) {
        return false;
      }

      switch (repeatableMove.move.id) {
        case MoveId.MIMIC:
        case MoveId.MIRROR_MOVE:
        case MoveId.TRANSFORM:
        case MoveId.STRUGGLE:
        case MoveId.SKETCH:
        case MoveId.SLEEP_TALK:
        case MoveId.ENCORE:
          return false;
      }

      return true;
    };
  }
}
