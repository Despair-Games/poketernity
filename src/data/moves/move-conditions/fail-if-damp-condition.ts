import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { MoveConditionFunc } from "#types/move-types";
import { ValueHolder } from "#utils/common-utils";
import { inSpeedOrder } from "#utils/speed-order-generator";

/**
 *  TODO: Add simulated support
 */
export const failIfDampCondition: MoveConditionFunc = (user, _target, move) => {
  const cancelled = new ValueHolder(false);
  const moveName = user.getPokemonMove(move.id)?.name ?? move.name;

  for (const pokemon of inSpeedOrder()) {
    applyAbAttrs<FieldPreventExplosionLikeAbAttr>(
      AbAttrFlag.FIELD_PREVENT_EXPLOSION_LIKE,
      pokemon,
      false,
      cancelled,
      getPokemonNameWithAffix(user),
      moveName,
    );
    if (cancelled.value) {
      break;
    }
  }
  return !cancelled.value;
};
