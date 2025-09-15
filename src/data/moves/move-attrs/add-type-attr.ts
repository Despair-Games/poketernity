/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ALLY_TARGET_PENALTY } from "#constants/ai-constants";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { getTypeDamageMultiplier } from "#data/type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to add a set type to the target.
 * Note that this doesn't overwrite any of the target's base types;
 * it only overwrites types added by other moves with this attribute.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Forest%27s_Curse_(move) | Forest's Curse}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Trick-or-Treat_(move) | Trick-or-Treat}.
 */
export class AddTypeAttr extends MoveEffectAttr {
  private readonly type: ElementalType;

  constructor(type: ElementalType) {
    super(false);

    this.type = type;
  }

  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    target.summonData.addedType = this.type;
    target.updateInfo();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:addType", {
        typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, this.type)}`),
        pokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => !target.isTerastallized && !target.getTypes().includes(this.type);
  }

  /**
   * @returns The inverse {@link getTypeChangeScore | score} for adding this effect's type
   * to the given target.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    return -this.getTypeChangeScore(user, target);
  }

  /**
   * @returns A {@link getTypeChangeScore | score} for adding this effect's type to the given target.
   * If this score is negative, this defers to the {@linkcode ALLY_TARGET_PENALTY} instead
   */
  public override getAllyTargetScore(user: EnemyPokemon, target: EnemyPokemon, _move: Move): number | null {
    const typeChangeScore = this.getTypeChangeScore(user, target);
    return typeChangeScore >= 0 ? typeChangeScore : null;
  }

  /**
   * Calculates a score to estimate how much the target would benefit from
   * gaining this effect's type. A target is perceived to benefit from this effect if
   * - The added type reduces the effectiveness of all known attacks from the target's opponents.
   * - The user is faster than all of its active opponents.
   *
   * Conversely, this effect is perceived as a drawback if the added type increases the effectiveness
   * of at least one attack from the target's opponent(s).
   * @param user - The {@linkcode EnemyPokemon} evaluating this effect
   * @param target - The {@linkcode Pokemon} this effect is evaluated against
   * @returns An integer score representing how much this effect benefits the target
   */
  private getTypeChangeScore(user: EnemyPokemon, target: Pokemon): number {
    const oppMoveTypes = new Set(
      target.getOpponents().flatMap((opp) => {
        const attackMoves = opp.isOpponent(user) ? opp.estimateAttackMoves() : opp.getAttackMoves(true);
        return attackMoves.map((mv) => opp.getMoveType(mv));
      }),
    );

    const modDamageMultiplier = Math.max(...[...oppMoveTypes].map((t) => getTypeDamageMultiplier(t, this.type)));
    if (modDamageMultiplier >= 1) {
      return modDamageMultiplier > 1 ? MINOR_EFFECT_SCORE_PENALTY : 0;
    }

    const userOutspeeds = user.getOpponents().every((opp) => user.outspeeds(opp, true));
    return userOutspeeds || !globalScene.currentBattle.double ? MINOR_EFFECT_SCORE_BONUS : 0;
  }
}
