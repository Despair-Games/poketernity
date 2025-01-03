import { MoveUsedEvent } from "#app/events/battle-scene";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute used for moves that reduce PP of the target's last used move.
 * Used for Spite.
 * @extends MoveEffectAttr
 */
export class ReducePpMoveAttr extends MoveEffectAttr {
  protected reduction: number;
  constructor(reduction: number) {
    super();
    this.reduction = reduction;
  }

  /** Reduces the PP of the target's last-used move by an amount based on this attribute instance's {@linkcode reduction}. */
  override apply(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    const lastMove = target.getLastXMoves()[0];
    const movesetMove = target.getMoveset().find((m) => m.moveId === lastMove.move)!;
    const lastPpUsed = movesetMove.ppUsed;
    movesetMove.ppUsed = Math.min(lastPpUsed + this.reduction, movesetMove.getMovePp());

    const message = i18next.t("battle:ppReduced", {
      targetName: getPokemonNameWithAffix(target),
      moveName: movesetMove.getName(),
      reduction: movesetMove.ppUsed - lastPpUsed,
    });
    globalScene.eventTarget.dispatchEvent(new MoveUsedEvent(target.id, movesetMove.getMove(), movesetMove.ppUsed));
    globalScene.queueMessage(message);

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      const lastMove = target.getLastXMoves()[0];
      if (lastMove) {
        const movesetMove = target.getMoveset().find((m) => m.moveId === lastMove.move);
        return !!movesetMove?.getPpRatio();
      }
      return false;
    };
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    const lastMove = target.getLastXMoves()[0];
    if (lastMove) {
      const movesetMove = target.getMoveset().find((m) => m.moveId === lastMove.move);
      if (movesetMove) {
        const maxPp = movesetMove.getMovePp();
        const ppLeft = maxPp - movesetMove.ppUsed;
        const value = -(8 - Math.ceil(Math.min(maxPp, 30) / 5));
        if (ppLeft < 4) {
          return (value / 4) * ppLeft;
        }
        return value;
      }
    }

    return 0;
  }
}
