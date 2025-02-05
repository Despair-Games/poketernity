// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CopyMoveAttr } from "#app/data/move-attrs/copy-move-attr";
import type { RandomMoveAttr } from "#app/data/move-attrs/random-move-attr";
import type { RandomMovesetMoveAttr } from "#app/data/move-attrs/random-moveset-move-attr";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { type Move, getMoveTargets } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import { MovePhase } from "#app/phases/move-phase";
import type { BooleanHolder } from "#app/utils";
import type { BattlerIndex } from "#enums/battler-index";
import { MoveTarget } from "#enums/move-target";
import type { MoveId } from "#enums/move-id";
import { PokemonMove } from "#app/field/pokemon-move";

/**
 * Attribute used to call a move.
 * Used by other move attributes: {@linkcode RandomMoveAttr}, {@linkcode RandomMovesetMoveAttr}, {@linkcode CopyMoveAttr}
 * @see {@linkcode apply} for move call
 * @extends OverrideMoveEffectAttr
 */
export abstract class CallMoveAttr extends OverrideMoveEffectAttr {
  protected invalidMoves: MoveId[];
  protected hasTarget: boolean;
  public readonly callsOtherMoves: boolean = true;

  override apply(user: Pokemon, target: Pokemon, move: Move, overridden: BooleanHolder): boolean {
    const replaceMoveTarget = [MoveTarget.NEAR_OTHER, MoveTarget.DRAGON_DARTS].includes(move.moveTarget)
      ? MoveTarget.NEAR_ENEMY
      : undefined;
    const moveTargets = getMoveTargets(user, move.id, replaceMoveTarget);

    if (moveTargets.targets.length === 0) {
      return false;
    }

    let targets: BattlerIndex[];
    if (moveTargets.multiple || moveTargets.targets.length === 1) {
      targets = moveTargets.targets;
    } else if (this.hasTarget) {
      targets = [target.getBattlerIndex()];
    } else {
      targets = [moveTargets.targets[user.randSeedInt(moveTargets.targets.length)]];
    }

    user.getMoveQueue().push({ moveId: move.id, targets, virtual: true, ignorePP: true });
    globalScene.unshiftPhase(new LoadMoveAnimPhase(move.id));
    globalScene.unshiftPhase(new MovePhase(user, targets, new PokemonMove(move.id, 0, 0, true), true, true));

    overridden.value = true;

    return true;
  }
}
