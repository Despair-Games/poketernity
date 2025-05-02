import type { EnemyPokemon, Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { allAbilities } from "#app/data/data-lists";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { detrimentalAbilities, highValueAbilities } from "#app/utils/ability-utils";

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
   * If the user has a {@link detrimentalAbilities | detrimental ability}, or
   * the target has a {@link highValueAbilities | high-value ability},
   * grants (+1) with a 50% chance of additional (+1) to effect score.
   */
  override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (highValueAbilities.includes(user.getAbility().id)) {
      return -5;
    }

    const userHasDetrimentalAbility = detrimentalAbilities.includes(user.getAbility().id);
    const targetHasHighValueAbility = target
      .getAbilities({ revealedOnly: true })
      .some((ab) => !ab.passive && highValueAbilities.includes(ab.ability.id));

    return userHasDetrimentalAbility || targetHasHighValueAbility ? 1 + this.getRandomScore(user, 50) : 0;
  }
}
