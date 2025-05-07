import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HIGH_VALUE_ABILITIES } from "#app/constants/ability-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
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

  /**
   * If the target has a {@link HIGH_VALUE_ABILITIES | high-value ability}, grants (+2)
   * effect score. Otherwise, this has a 60% chance to grant (+1).
   */
  override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    /** Total score if the target opponent has a {@link HIGH_VALUE_ABILITIES | high-value ability} */
    const highValueSuppressScore = 2;
    /** Total score if the target opponent does not have a high-value ability */
    const baseScore = this.getRandomScore(user, 60);

    const targetHasHighValueAbility = target
      .getAbilities({ revealedOnly: true })
      .some((ab) => !ab.passive && HIGH_VALUE_ABILITIES.includes(ab.ability.id));

    return targetHasHighValueAbility ? highValueSuppressScore : baseScore;
  }
}
