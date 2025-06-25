// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { CopycatAttr } from "#moves/copycat-attr";
import type { MetronomeAttr } from "#moves/metronome-attr";
import type { NaturePowerAttr } from "#moves/nature-power-attr";
import type { RandomMovesetMoveAttr } from "#moves/random-moveset-move-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#field/pokemon";
import { type Move, getMoveTargets } from "#moves/move";
import { OverrideMoveEffectAttr } from "#moves/override-move-effect-attr";
import { LoadMoveAnimPhase } from "#phases/load-move-anim-phase";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute used to call a different move.
 *
 * Used by other move attributes: {@linkcode MetronomeAttr}, {@linkcode RandomMovesetMoveAttr}, {@linkcode CopycatAttr}
 * and {@linkcode NaturePowerAttr}
 * @see {@linkcode apply} for move call
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
