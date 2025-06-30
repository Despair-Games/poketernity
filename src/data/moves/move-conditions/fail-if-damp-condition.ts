import { getAbApplyFunc } from "#abilities/apply-ab-attrs";
import type { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-condition-func";
import { BooleanHolder } from "#utils/common-utils";

/**
 * Condition function for moves that are negated by an active
 * Pokemon's {@link https://bulbapedia.bulbagarden.net/wiki/Damp_(Ability) | Damp} Ability.
 * @param user - The {@linkcode Pokemon} using the move
 * @param _target - (Unused) The {@linkcode Pokemon} targeted by the move
 * @param move - The {@linkcode Move} being used
 * @param simulated - If `true`, disables Damp's trigger messages
 * @returns `true` if the move can be used successfully
 */
export const failIfDampCondition: MoveConditionFunc = (
  user: Pokemon,
  _target: Pokemon,
  move: Move,
  simulated: boolean,
) => {
  const cancelled = new BooleanHolder(false);
  const applyAbFunc = getAbApplyFunc(simulated ? AbilityApplyMode.REVEALED : AbilityApplyMode.DEFAULT);
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
