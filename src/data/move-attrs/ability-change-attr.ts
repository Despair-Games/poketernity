import type { Abilities } from "#enums/abilities";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { UnsuppressableAbilityAbAttr } from "#app/data/ab-attrs/unsuppressable-ability-ab-attr";
import { allAbilities } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { SpeciesFormChangeRevertWeatherFormTrigger } from "#app/data/pokemon-forms";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class AbilityChangeAttr extends MoveEffectAttr {
  public ability: Abilities;

  constructor(ability: Abilities, selfTarget?: boolean) {
    super(selfTarget);

    this.ability = ability;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const moveTarget = this.selfTarget ? user : target;

    moveTarget.summonData.ability = this.ability;
    globalScene.triggerPokemonFormChange(moveTarget, SpeciesFormChangeRevertWeatherFormTrigger);

    globalScene.queueMessage(
      i18next.t("moveTriggers:acquiredAbility", {
        pokemonName: getPokemonNameWithAffix(this.selfTarget ? user : target),
        abilityName: allAbilities[this.ability].name,
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) =>
      !(this.selfTarget ? user : target).getAbility().hasAttr(UnsuppressableAbilityAbAttr)
      && (this.selfTarget ? user : target).getAbility().id !== this.ability;
  }
}
