// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CopycatAttr } from "#app/data/moves/move-attrs/copycat-attr";
import type { MetronomeAttr } from "#app/data/moves/move-attrs/metronome-attr";
import type { NaturePowerAttr } from "#app/data/moves/move-attrs/nature-power-attr";
import type { RandomMovesetMoveAttr } from "#app/data/moves/move-attrs/random-moveset-move-attr";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { type Move, getMoveTargets } from "#app/data/moves/move";
import { OverrideMoveEffectAttr } from "#app/data/moves/move-attrs/override-move-effect-attr";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import type { BooleanHolder } from "#app/utils";
import type { BattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";

/**
 * Attribute used to call a different move.
 *
 * Used by other move attributes: {@linkcode MetronomeAttr}, {@linkcode RandomMovesetMoveAttr}, {@linkcode CopycatAttr}
 * and {@linkcode NaturePowerAttr}
 * @see {@linkcode apply} for move call
 * @extends OverrideMoveEffectAttr
 */
export abstract class CallMoveAttr extends OverrideMoveEffectAttr {
  protected invalidMoves: ReadonlySet<MoveId>;
  protected hasTarget: boolean;
  public override readonly callsOtherMoves: boolean = true;

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

    user.getMoveQueue().push({ move: move, targets, virtual: true, ignorePP: true, type: user.getMoveType(move) });
    globalScene.phaseManager.unshiftPhase(new LoadMoveAnimPhase(move.id));
    globalScene.phaseManager.queueMovePhase({
      pokemon: user,
      targets,
      move: move.id,
      followUp: true,
      ignorePp: true,
      when: "eager",
    });

    overridden.value = true;

    return true;
  }
}
