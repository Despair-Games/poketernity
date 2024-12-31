import { type Pokemon, type PlayerPokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import { type Move, getMoveTargets } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";
import { lastMoveCopiableCondition, type MoveConditionFunc } from "../move-conditions";

export class CopyMoveAttr extends OverrideMoveEffectAttr {
  /** Copies the last move used in battle and invokes it against random target(s) */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const lastMove = globalScene.currentBattle.lastMove;

    const moveTargets = getMoveTargets(user, lastMove);
    if (!moveTargets.targets.length) {
      return false;
    }

    const targets =
      moveTargets.multiple || moveTargets.targets.length === 1
        ? moveTargets.targets
        : moveTargets.targets.indexOf(target.getBattlerIndex()) > -1
          ? [target.getBattlerIndex()]
          : [moveTargets.targets[user.randSeedInt(moveTargets.targets.length)]];
    user.getMoveQueue().push({ move: lastMove, targets: targets, ignorePP: true });

    globalScene.unshiftPhase(
      new MovePhase(user as PlayerPokemon, targets, new PokemonMove(lastMove, 0, 0, true), true),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return lastMoveCopiableCondition;
  }
}
