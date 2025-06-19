import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
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

    globalScene.phaseManager.queueMessagePhase(
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
}
