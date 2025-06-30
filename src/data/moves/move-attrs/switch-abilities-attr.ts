import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { DETRIMENTAL_ABILITIES } from "#constants/ability-constants";
import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";
import i18next from "i18next";

/**
 * Attribute to swap the user and target's abilities (if both are swappable).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Skill_Swap_(move) | Skill Swap}.
 */
export class SwitchAbilitiesAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const tempAbilityId = user.getAbility().id;
    user.summonData.ability = target.getAbility().id;
    target.summonData.ability = tempAbilityId;

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:swappedAbilitiesWithTarget", { pokemonName: getPokemonNameWithAffix(user) }),
    );
    // Swaps Forecast/Flower Gift from Castform/Cherrim
    globalScene.arena.triggerWeatherBasedFormChangesToNormal();
    // Swaps Forecast/Flower Gift to Castform/Cherrim (edge case)
    globalScene.arena.triggerWeatherBasedFormChanges();

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) =>
      !user.getAbility().hasAttrFlag(AbAttrFlag.UNSWAPPABLE_ABILITY)
      && !target.getAbility().hasAttrFlag(AbAttrFlag.UNSWAPPABLE_ABILITY);
  }

  /**
   * If the user has a {@link DETRIMENTAL_ABILITIES | detrimental ability}, or the target
   * has one of Huge Power, Pure Power, or Contrary, grants a (+2) effect score bonus
   */
  override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    /**
     * Note: this only uses a subset of {@linkcode HIGH_VALUE_ABILITIES} since
     * - Desolate Land and Primordial Sea are symmetrical effects
     * - Wonder Guard cannot be swapped
     */
    const highValueSwappableAbilities = [AbilityId.HUGE_POWER, AbilityId.PURE_POWER, AbilityId.CONTRARY];

    const targetHasHighValueAbility = target
      .getAbilities({ revealedOnly: true })
      .some((ab) => !ab.passive && highValueSwappableAbilities.includes(ab.ability.id));

    if (DETRIMENTAL_ABILITIES.includes(user.getAbility().id) || targetHasHighValueAbility) {
      return MAJOR_EFFECT_SCORE_BONUS;
    }
    return 0;
  }
}
