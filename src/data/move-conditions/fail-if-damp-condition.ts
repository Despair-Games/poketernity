import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { applyAbAttrs } from "#app/data/apply-ab-attrs";
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
      applyAbAttrs(
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
