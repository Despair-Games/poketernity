import { getPokemonNameWithAffix } from "#app/messages";
import {
  FAVORABLE_MATCHUP_SCORE_THRESHOLD,
  MAJOR_EFFECT_SCORE_BONUS,
  MINOR_EFFECT_SCORE_BONUS,
} from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to put in a {@link https://bulbapedia.bulbagarden.net/wiki/Substitute_(doll) | Substitute Doll}
 * for the user.
 *
 * This attr is only used for Substitute and Shed Tail:
 * - Substitute costs 1/4 of the user's max hp and rounds down
 * - Shed tail costs 1/2 of the user's max hp and rounds up
 * @see {@linkcode apply}
 */
export class AddSubstituteAttr extends MoveEffectAttr {
  private isShedTail: boolean;

  constructor(isShedTail: boolean = false) {
    super(true);

    this.isShedTail = isShedTail;
  }

  public override applyEffect(user: Pokemon, _target: Pokemon, move: Move): boolean {
    const hpCost = this.getHpCost(user);
    user.damageAndUpdate(hpCost, {
      result: HitResult.OTHER,
      ignoreSegments: true,
      preventEndure: true,
    });
    user.addTag(BattlerTagType.SUBSTITUTE, 0, move.id, user.id);
    return true;
  }

  private getHpCost(user: Pokemon): number {
    if (this.isShedTail) {
      return Math.ceil(user.getMaxHp() * 0.5);
    }
    return Math.floor(user.getMaxHp() * 0.25);
  }

  public override getCondition(): MoveConditionFunc {
    /**
     * Only works if
     * - The user does not have a substitute out already
     * - The user has enough HP
     * - THe user has more than 1 max hp (wonder guard users)
     */
    return (user, _target, _move) =>
      !user.hasTag(BattlerTagType.SUBSTITUTE) && user.hp > this.getHpCost(user) && user.getMaxHp() > 1;
  }

  public override getFailedText(
    user: Pokemon,
    _target: Pokemon,
    _move: Move,
    _cancelled: BooleanHolder,
  ): string | null {
    if (user.hasTag(BattlerTagType.SUBSTITUTE)) {
      return i18next.t("moveTriggers:substituteOnOverlap", { pokemonName: getPokemonNameWithAffix(user) });
    }
    if (user.hp <= this.getHpCost(user) || user.getMaxHp() === 1) {
      return i18next.t("moveTriggers:substituteNotEnoughHp");
    }
    return i18next.t("battle:attackFailed");
  }

  /**
   * @returns
   * - (-10) if the user is a Boss Pokemon
   * - A {@linkcode MINOR_EFFECT_SCORE_BONUS} if this attribute is for Shed Tail's substitute effect
   * - A {@linkcode MAJOR_EFFECT_SCORE_BONUS} if this attribute is for Substitute and the
   *   user has a {@link FAVORABLE_MATCHUP_SCORE_THRESHOLD | favorable matchup} against its opponents
   * - (+0) if none of the above conditions apply
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.isBoss()) {
      return -10;
    }

    if (this.isShedTail) {
      return MINOR_EFFECT_SCORE_BONUS;
    }

    return user.getAverageMatchupScore() >= FAVORABLE_MATCHUP_SCORE_THRESHOLD ? MAJOR_EFFECT_SCORE_BONUS : 0;
  }
}
