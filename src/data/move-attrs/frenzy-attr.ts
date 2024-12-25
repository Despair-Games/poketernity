import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import { type Move, applyMoveAttrs } from "#app/data/move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class FrenzyAttr extends MoveEffectAttr {
  constructor() {
    super(true, { lastHitOnly: true });
  }

  override canApply(user: Pokemon, target: Pokemon, _move: Move, _args: any[]) {
    return !(this.selfTarget ? user : target).isFainted();
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (!user.getTag(BattlerTagType.FRENZY) && !user.getMoveQueue().length) {
      const turnCount = user.randSeedIntRange(1, 2);
      new Array(turnCount)
        .fill(null)
        .map(() => user.getMoveQueue().push({ move: move.id, targets: [target.getBattlerIndex()], ignorePP: true }));
      user.addTag(BattlerTagType.FRENZY, turnCount, move.id, user.id);
    } else {
      applyMoveAttrs(AddBattlerTagAttr, user, target, move, args);
      user.lapseTag(BattlerTagType.FRENZY); // if FRENZY is already in effect (moveQueue.length > 0), lapse the tag
    }

    return true;
  }
}
