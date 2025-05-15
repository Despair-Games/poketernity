import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BooleanHolder } from "#utils/common-utils";

/**
 *  TODO: Add simulated support
 */
export const failIfDampCondition: MoveConditionFunc = (user, _target, move) => {
  const cancelled = new BooleanHolder(false);
  globalScene
    .getField(true)
    .map((p) =>
      applyAbAttrs<FieldPreventExplosionLikeAbAttr>(
        AbAttrFlag.FIELD_PREVENT_EXPLOSION_LIKE,
        p,
        false,
        cancelled,
        getPokemonNameWithAffix(user),
        move.name,
      ),
    );
  return !cancelled.value;
};
