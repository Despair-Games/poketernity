import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { type Move, getMoveTargets } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { lastMoveCopiableCondition } from "#app/data/move-conditions/last-move-copiable-condition";

/**
 * Attribute to copy the last move used in battle and invoke it against random target(s).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mirror_Move_(move) | Mirror Move}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Copycat_(move) | Copycat}.
 * @extends OverrideMoveEffectAttr
 */
export class CopyMoveAttr extends OverrideMoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const lastMove = globalScene.currentBattle.lastMove;

    const moveTargets = getMoveTargets(user, lastMove.id);
    if (!moveTargets.targets.length) {
      return false;
    }

    const targets =
      moveTargets.multiple || moveTargets.targets.length === 1
        ? moveTargets.targets
        : moveTargets.targets.indexOf(target.getBattlerIndex()) > -1
          ? [target.getBattlerIndex()]
          : [moveTargets.targets[user.randSeedInt(moveTargets.targets.length)]];
    user.getMoveQueue().push({ moveId: lastMove.id, targets: targets, ignorePP: true });

    globalScene.useMove({ pokemon: user, targets, move: lastMove.id, followUp: true, when: "eager" });

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return lastMoveCopiableCondition;
  }

  override isCopyMoveAttr(): this is this {
    return true;
  }
}
