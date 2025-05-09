import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { allAbilities } from "#app/data/data-lists";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { SpeciesFormChangeRevertWeatherFormTrigger } from "#app/data/pokemon-forms";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HIGH_VALUE_ABILITIES } from "#app/constants/ability-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { AbilityId } from "#enums/ability-id";
import i18next from "i18next";
import { MAJOR_EFFECT_SCORE_BONUS } from "#app/constants/ai-constants";

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

    globalScene.phaseManager.queueMessagePhase(
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
