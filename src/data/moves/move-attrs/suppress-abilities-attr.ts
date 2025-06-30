import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HIGH_VALUE_ABILITIES } from "#constants/ability-constants";
import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";
import i18next from "i18next";

/**
 * Attribute used for moves that suppress abilities like {@linkcode MoveId.GASTRO_ACID}.
 * A suppressed ability cannot be activated.
 *
 */
export class SuppressAbilitiesAttr extends MoveEffectAttr {
  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    target.summonData.abilitySuppressed = true;
    globalScene.arena.triggerWeatherBasedFormChangesToNormal();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:suppressAbilities", { pokemonName: getPokemonNameWithAffix(target) }),
    );

    return true;
  }

  /** Causes the effect to fail when the target's ability is unsupressable or already suppressed. */
  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) =>
      !target.getAbility().hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY) && !target.summonData.abilitySuppressed;
  }

  /**
   * If the target has a {@link HIGH_VALUE_ABILITIES | high-value ability}, grants (+2)
   * effect score. Otherwise, this has a 60% chance to grant (+1).
   */
  override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const targetHasHighValueAbility = target
      .getAbilities({ revealedOnly: true })
      .some((ab) => !ab.passive && HIGH_VALUE_ABILITIES.includes(ab.ability.id));

    return targetHasHighValueAbility ? MAJOR_EFFECT_SCORE_BONUS : this.getRandomScore(user, 60);
  }
}
