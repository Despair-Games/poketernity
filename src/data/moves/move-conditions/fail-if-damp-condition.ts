import { applyAbAttrs, applyRevealedAbAttrs } from "#abilities/apply-ab-attrs";
import type { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";
import { BooleanHolder } from "#utils/common-utils";

export const failIfDampCondition: MoveConditionFunc = (
  user: Pokemon,
  _target: Pokemon,
  move: Move,
  simulated: boolean,
) => {
  const cancelled = new BooleanHolder(false);
  const applyAbFunc = simulated ? applyRevealedAbAttrs : applyAbAttrs;
  globalScene
    .getField(true)
    .forEach((p) =>
      applyAbFunc<FieldPreventExplosionLikeAbAttr>(
        AbAttrFlag.FIELD_PREVENT_EXPLOSION_LIKE,
        p,
        simulated,
        cancelled,
        user,
        move,
      ),
    );
  return !cancelled.value;
};
