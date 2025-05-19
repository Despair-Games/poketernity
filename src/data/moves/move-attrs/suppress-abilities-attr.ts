import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";
import i18next from "i18next";

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

    globalScene.phaseManager.queueMessagePhase(
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
