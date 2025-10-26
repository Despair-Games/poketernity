import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MoveConditionFunc } from "#types/move-types";
import { ValueHolder } from "#utils/common-utils";

/**
 *  TODO: Add simulated support
 */
export const failIfDampCondition: MoveConditionFunc = (user, _target, move) => {
  const cancelled = new ValueHolder(false);
  const moveName = user.getPokemonMove(move.id)?.name ?? move.name;
  globalScene
    .getField(true)
    .map((p) =>
      applyAbAttrs("FieldPreventExplosionLikeAbAttr", p, false, cancelled, getPokemonNameWithAffix(user), moveName),
    );
  return !cancelled.value;
};
