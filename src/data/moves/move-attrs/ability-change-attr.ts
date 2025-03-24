import type { AbilityId } from "#enums/ability-id";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { allAbilities } from "#app/data/data-lists";
import type { Move } from "#app/data/moves/move";
import { SpeciesFormChangeRevertWeatherFormTrigger } from "#app/data/pokemon-forms";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Attribute to change a target's ability to a set ability.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Worry_Seed_(move) | Worry Seed}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Simple_Beam_(move) | Simple Beam}.
 * @extends MoveEffectAttr
 */
export class AbilityChangeAttr extends MoveEffectAttr {
  public ability: AbilityId;

  constructor(ability: AbilityId, selfTarget?: boolean) {
    super(selfTarget);

    this.ability = ability;
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
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
      !(this.selfTarget ? user : target).getAbility().hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY)
      && (this.selfTarget ? user : target).getAbility().id !== this.ability;
  }
}
