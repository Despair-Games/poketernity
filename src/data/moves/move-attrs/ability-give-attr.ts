import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { DETRIMENTAL_ABILITIES, HIGH_VALUE_ABILITIES } from "#constants/ability-constants";
import { BAD_MOVE_PENALTY, MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { allAbilities } from "#data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";
import i18next from "i18next";

/**
 * Attribute to give the user's ability to the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Entrainment_(move) | Entrainment}.
 * @extends MoveEffectAttr
 */
export class AbilityGiveAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    target.summonData.ability = user.getAbility().id;

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:acquiredAbility", {
        pokemonName: getPokemonNameWithAffix(target),
        abilityName: allAbilities[user.getAbility().id].name,
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) =>
      !user.getAbility().hasAttrFlag(AbAttrFlag.UNCOPIABLE_ABILITY)
      && !target.getAbility().hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY)
      && user.getAbility().id !== target.getAbility().id;
  }

  /**
   * If the user has a {@link DETRIMENTAL_ABILITIES | detrimental ability}, or
   * the target has a {@link HIGH_VALUE_ABILITIES | high-value ability},
   * grants (+1) with a 50% chance of additional (+1) to effect score.
   */
  override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (HIGH_VALUE_ABILITIES.includes(user.getAbility().id)) {
      return BAD_MOVE_PENALTY;
    }

    const userHasDetrimentalAbility = DETRIMENTAL_ABILITIES.includes(user.getAbility().id);
    const targetHasHighValueAbility = target
      .getAbilities({ revealedOnly: true })
      .some((ab) => !ab.passive && HIGH_VALUE_ABILITIES.includes(ab.ability.id));

    return userHasDetrimentalAbility || targetHasHighValueAbility
      ? MINOR_EFFECT_SCORE_BONUS + this.getRandomScore(user, 50)
      : 0;
  }
}
