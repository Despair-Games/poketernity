/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ALLY_TARGET_PENALTY } from "#constants/ai-constants";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { getTypeDamageMultiplier } from "#data/type";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Abstract attribute to change a Pokemon's type to a single type.
 * This effect may apply to the move's user or target.
 * @abstract
 */
export abstract class ChangeTypeAttr extends MoveEffectAttr {
  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const pokemon = this.selfTarget ? user : target;
    const targetType = this.getType(user, target);

    pokemon.setTemporaryTypes(targetType);
    pokemon.updateInfo();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(pokemon),
        typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, targetType)}`),
      }),
    );

    return true;
  }

  /**
   * @param user - The {@linkcode Pokemon} using the move
   * @param target - The {@linkcode Pokemon} targeted by the move
   * @returns The {@linkcode ElementalType} this effect's target is temporarily set to
   */
  protected abstract getType(_user: Pokemon, _target: Pokemon): ElementalType;

  /**
   * All moves that change type fail if the effect's target
   * is Terastallized or has Multitype or RKS System as an ability
   */
  public override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const pokemon = this.selfTarget ? user : target;
      return (
        !pokemon.isTerastallized
        && !pokemon.hasAbility(AbilityId.MULTITYPE)
        && !pokemon.hasAbility(AbilityId.RKS_SYSTEM)
      );
    };
  }

  /**
   * @returns A {@link getTypeChangeScore | score} based on how much the type change benefits this effect's
   * target. This score is inverted if the target is an opponent to the user.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    return this.selfTarget ? this.getTypeChangeScore(user, user) : -this.getTypeChangeScore(user, target);
  }

  /**
   * @returns A {@link getTypeChangeScore | score} based on how much the type change benefits the target.
   * If the target is determined to be negatively affected, this defers to the {@linkcode ALLY_TARGET_PENALTY}
   */
  public override getAllyTargetScore(user: EnemyPokemon, target: EnemyPokemon, _move: Move): number | null {
    const typeChangeScore = this.getTypeChangeScore(user, target);
    return typeChangeScore >= 0 ? typeChangeScore : null;
  }

  /**
   * Calculates a score to estimate how much the given target benefits from
   * this effect changing its type. A target is perceived to benefit from this effect if
   * all of the following conditions are met:
   * - The target's defensive typing against active opponents is improved by the type change
   * - The user outspeeds all active opponents
   * - The target has an attack that gains STAB from the type change
   *
   * Conversely, this effect is penalized if the target's defensive typing is not improved by the type change.
   * @param user - The {@linkcode EnemyPokemon} evaluating this effect
   * @param target - The {@linkcode Pokemon} this effect is evaluated against
   * @returns An integer score reflecting how much the target benefits from the effect
   */
  private getTypeChangeScore(user: EnemyPokemon, target: Pokemon): number {
    const opponents = target.getOpponents();
    const modifiedType = this.getType(user, target);

    // Current effectiveness is based on the most effective of each opponent's types (including Tera) against the target
    const defEffectiveness = opponents.map((opp) =>
      Math.max(...opp.getTypes(true).map((t) => target.getAttackTypeEffectiveness(t, undefined, false, true))),
    );
    const modDefEffectiveness = opponents.map((opp) =>
      Math.max(...opp.getTypes(true).map((t) => getTypeDamageMultiplier(t, modifiedType))),
    );

    const avgDefEffectiveness = defEffectiveness.reduce((total, de) => total + de) / defEffectiveness.length;
    const avgModDefEffectiveness = modDefEffectiveness.reduce((total, de) => total + de) / modDefEffectiveness.length;

    if (avgDefEffectiveness === 0 || avgModDefEffectiveness / avgDefEffectiveness >= 1) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }

    const outspeeds = opponents.every((opp) => user.outspeeds(opp, opp.isOpponent(user)));
    if (!outspeeds) {
      return 0;
    }

    const targetMoves = target.isAlly(user) ? target.getAttackMoves(true) : target.estimateAttackMoves();
    const targetHasModifiedStab = targetMoves.some((move) => target.getMoveType(move) === modifiedType);

    return targetHasModifiedStab ? MINOR_EFFECT_SCORE_BONUS : 0;
  }
}
