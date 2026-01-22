import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { MoveConditionFunc } from "#types/move-types";
import { ValueHolder } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";

// TODO: Add simulated support
export const failIfDampCondition: MoveConditionFunc = (user, _target, move): boolean => {
  const cancelled = new ValueHolder(false);

  for (const pokemon of inSpeedOrder()) {
    applyAbAttrs("FieldPreventExplosionLikeAbAttr", { pokemon, simulated: false, cancelled, attacker: user, move });
    if (cancelled.value) {
      break;
    }
  }
  return !cancelled.value;
};
