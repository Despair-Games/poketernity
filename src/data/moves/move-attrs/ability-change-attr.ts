import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HIGH_VALUE_ABILITIES } from "#constants/ability-constants";
import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { allAbilities } from "#data/data-lists";
import { SpeciesFormChangeRevertWeatherFormTrigger } from "#data/pokemon-forms";
import type { AbilityId } from "#enums/ability-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
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
      (this.selfTarget ? user : target).getAbility().isReplaceable
      && (this.selfTarget ? user : target).getAbility().id !== this.ability;
  }

  /**
   * If the target is an opponent and is known to have a high-value ability,
   * grants (+2) effect score.
   * @see {@linkcode HIGH_VALUE_ABILITIES}
   */
  override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const hasHighValueAbility = target
      .getAbilities({ canApplyOnly: true, revealedOnly: true })
      .filter((ab) => !ab.passive) // Remove this if passives are made to be overwritten
      .some((ab) => HIGH_VALUE_ABILITIES.includes(ab.ability.id));

    return hasHighValueAbility && user.isOpponent(target) ? MAJOR_EFFECT_SCORE_BONUS : 0;
  }
}
