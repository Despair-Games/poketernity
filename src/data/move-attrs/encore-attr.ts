import { AddBattlerTagAttr } from "#app/data/move-attrs/add-battler-tag-attr";
import type { MoveConditionFunc } from "#app/data/move-conditions";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";

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

      if (!repeatableMove.move || repeatableMove.virtual) {
        return false;
      }

      switch (repeatableMove.move) {
        case Moves.MIMIC:
        case Moves.MIRROR_MOVE:
        case Moves.TRANSFORM:
        case Moves.STRUGGLE:
        case Moves.SKETCH:
        case Moves.SLEEP_TALK:
        case Moves.ENCORE:
          return false;
      }

      return true;
    };
  }
}
