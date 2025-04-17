import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { allAbilities } from "#app/data/data-lists";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AbAttrFlag } from "#enums/ab-attr-flag";

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
}
