import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { FieldPreventExplosionLikeAbAttr } from "#app/data/abilities/ab-attrs/field-prevent-explosion-like-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";

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
