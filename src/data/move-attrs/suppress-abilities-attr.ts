import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Attribute used for moves that suppress abilities like {@linkcode MoveId.GASTRO_ACID}.
 * A suppressed ability cannot be activated.
 *
 * @extends MoveEffectAttr
 */
export class SuppressAbilitiesAttr extends MoveEffectAttr {
  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    target.summonData.abilitySuppressed = true;
    globalScene.arena.triggerWeatherBasedFormChangesToNormal();

    globalScene.queueMessage(
      i18next.t("moveTriggers:suppressAbilities", { pokemonName: getPokemonNameWithAffix(target) }),
    );

    return true;
  }

  /** Causes the effect to fail when the target's ability is unsupressable or already suppressed. */
  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) =>
      !target.getAbility().hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY) && !target.summonData.abilitySuppressed;
  }
}
