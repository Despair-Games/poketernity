//import { initMoveAnim, loadMoveAnimAssets } from "#app/data/battle-anims";
import { type Move, getMoveTargets } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";
import { type Pokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import type { BooleanHolder } from "#app/utils";
import { MoveTarget } from "#enums/move-target";
import type { Moves } from "#enums/moves";

/**
 * Attribute used to call a move.
 * Used by other move attributes: {@linkcode RandomMoveAttr}, {@linkcode RandomMovesetMoveAttr}, {@linkcode CopyMoveAttr}
 * @see {@linkcode apply} for move call
 * @extends OverrideMoveEffectAttr
 */
export abstract class CallMoveAttr extends OverrideMoveEffectAttr {
  protected invalidMoves: Moves[];
  protected hasTarget: boolean;

  override apply(user: Pokemon, target: Pokemon, move: Move, _overridden: BooleanHolder): boolean {
    const replaceMoveTarget = move.moveTarget === MoveTarget.NEAR_OTHER ? MoveTarget.NEAR_ENEMY : undefined;
    const moveTargets = getMoveTargets(user, move.id, replaceMoveTarget);

    if (moveTargets.targets.length === 0) {
      return false;
    }

    const targets =
      moveTargets.multiple || moveTargets.targets.length === 1
        ? moveTargets.targets
        : [
            this.hasTarget
              ? target.getBattlerIndex()
              : moveTargets.targets[user.randSeedInt(moveTargets.targets.length)],
          ]; // account for Mirror Move having a target already

    user.getMoveQueue().push({ move: move.id, targets: targets, virtual: true, ignorePP: true });
    globalScene.unshiftPhase(new MovePhase(user, targets, new PokemonMove(move.id, 0, 0, true), true, true));

    // Promise.resolve(initMoveAnim(user.scene, move.id).then(() => {
    //   loadMoveAnimAssets(user.scene, [ move.id ], true);
    // }));

    return true;
  }
}
