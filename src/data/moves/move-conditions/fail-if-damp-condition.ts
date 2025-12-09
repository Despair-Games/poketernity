import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MoveConditionFunc } from "#types/move-types";
import { ValueHolder } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";

// TODO: Add simulated support
export const failIfDampCondition: MoveConditionFunc = (user, _target, move) => {
  const cancelled = new ValueHolder(false);
  const moveName = user.getPokemonMove(move.id)?.name ?? move.name;

  for (const pokemon of inSpeedOrder()) {
    applyAbAttrs("FieldPreventExplosionLikeAbAttr", pokemon, false, cancelled, getPokemonNameWithAffix(user), moveName);
    if (cancelled.value) {
      break;
    }
  }
  return !cancelled.value;
};
