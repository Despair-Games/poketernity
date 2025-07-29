import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { RAPID_SPIN_REMOVABLE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute to remove battler tags within a given type set from the target.
 */
export class RemoveBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).removeTag(tagType);
    }

    return true;
  }

  /**
   * @returns The combined bonus or penalty for removing tags of this attribute's
   * {@linkcode tagTypes} from the target Pokemon. The modifier for each relevant tag is specified
   * by {@linkcode getTagRemovalBonus}, and the total score is {@link getTargetScoreMultiplier | multiplied}
   * based on whether the target of the effect is the user's ally or opponent.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const pokemon = this.selfTarget ? user : target;

    const baseScore = this.tagTypes.reduce(
      (score, tagType) => score + (pokemon.hasTag(tagType) ? this.getTagRemovalBonus(tagType) : 0),
      0,
    );

    const uncappedScore = baseScore * this.getTargetScoreMultiplier(user, target);
    return Math.min(uncappedScore, SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * @param user - The {@linkcode Pokemon} using the move
   * @param target - The {@linkcode Pokemon} targeted by the move
   * @returns `-1` if a move action would apply this effect to any of the user's
   * opponents; `1` otherwise.
   */
  private getTargetScoreMultiplier(user: EnemyPokemon, target: Pokemon): number {
    if (this.selfTarget || !user.isOpponent(target)) {
      return 1;
    }
    return -1;
  }

  /**
   * @param tagType - The {@linkcode BattlerTagType} to evaluate
   * @returns The Effect Score modifier granted when removing a tag of the
   * specified type, assuming it's removed from an {@linkcode EnemyPokemon}.
   * With {@linkcode getTargetScoreMultiplier}, tags removed from {@linkcode PlayerPokemon}
   * should yield the opposite score.
   */
  private getTagRemovalBonus(tagType: BattlerTagType): number {
    if (RAPID_SPIN_REMOVABLE_BATTLER_TAG_TYPES.includes(tagType)) {
      return MINOR_EFFECT_SCORE_BONUS;
    }

    if (tagType === BattlerTagType.FLOATING || tagType === BattlerTagType.STOCKPILING) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }

    return 0;
  }
}
