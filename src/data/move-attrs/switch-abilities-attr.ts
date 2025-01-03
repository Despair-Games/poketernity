import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { UnswappableAbilityAbAttr } from "#app/data/ab-attrs/unswappable-ability-ab-attr";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to swap the user and target's abilities (if both are swappable).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Skill_Swap_(move) Skill Swap}.
 * @extends MoveEffectAttr
 */
export class SwitchAbilitiesAttr extends MoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const tempAbilityId = user.getAbility().id;
    user.summonData.ability = target.getAbility().id;
    target.summonData.ability = tempAbilityId;

    globalScene.queueMessage(
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
      !user.getAbility().hasAttr(UnswappableAbilityAbAttr) && !target.getAbility().hasAttr(UnswappableAbilityAbAttr);
  }
}
