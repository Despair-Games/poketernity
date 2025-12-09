import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { allAbilities } from "#data/data-lists";
import { SpeciesFormChangeRevertWeatherFormTrigger } from "#data/pokemon-forms";
import type { AbilityId } from "#enums/ability-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import i18next from "i18next";

/**
 * Attribute to change a target's ability to a set ability.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Worry_Seed_(move) | Worry Seed}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Simple_Beam_(move) | Simple Beam}.
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

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:acquiredAbility", {
        pokemonName: getPokemonNameWithAffix(this.selfTarget ? user : target),
        abilityName: allAbilities[this.ability].name,
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) =>
      (this.selfTarget ? user : target).getAbility().replaceable
      && (this.selfTarget ? user : target).getAbility().id !== this.ability;
  }
}
