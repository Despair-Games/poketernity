import { globalScene } from "#app/global-scene";
import { ConditionalProtectTag } from "#arena-tags/conditional-protect-tag";
import { allMoves } from "#data/data-lists";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";
import type { MoveEffectPhase } from "#phases/move-effect-phase";
import type { ProtectConditionFunc } from "#types/protect-condition-func";

/**
 * Condition function for {@link https://bulbapedia.bulbagarden.net/wiki/Quick_Guard_(move) Quick Guard's}
 * protection effect.
 * @param _arena {@linkcode Arena} The arena containing the protection effect
 * @param moveId {@linkcode MoveId} The move to check against this condition
 * @returns `true` if the incoming move's priority is greater than 0.
 *   This includes moves with modified priorities from abilities (e.g. Prankster)
 */
const QuickGuardConditionFunc: ProtectConditionFunc = (_arena, moveId) => {
  const move = allMoves.get(moveId);
  const effectPhase = globalScene.phaseManager.getCurrentPhase();

  if (effectPhase?.is<MoveEffectPhase>(PhaseId.MOVE_EFFECT)) {
    const attacker = effectPhase.getUserPokemon();
    if (attacker) {
      return move.getPriority(attacker) > 0;
    }
  }
  return move.priority > 0;
};

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Quick_Guard_(move) Quick Guard}.
 * *Condition:* The incoming move has increased priority.
 * @extends ConditionalProtectTag
 */
export class QuickGuardTag extends ConditionalProtectTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.QUICK_GUARD, MoveId.QUICK_GUARD, sourceId, side, QuickGuardConditionFunc);
  }
}
