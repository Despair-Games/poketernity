import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { MOVE_LOCK_TAG_TYPES, SEMI_INVULNERABLE_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { failOnGravityCondition } from "#moves/fail-on-gravity-condition";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute implementing the charging phase effects of {@link https://bulbapedia.bulbagarden.net/wiki/Sky_Drop_(move) | Sky Drop}.
 * Grants semi-invulnerability to the user and target and immobilizes the target.
 */
export class SkyDropAttr extends MoveEffectAttr {
  /**
   * Makes the user and target semi-invulnerable, immobilizes the target,
   * and removes all of the target's queued moves (including Frenzy moves).
   */
  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    // Add Sky Drop tag to both user and target
    [user, target].forEach((p) => p.addTag(BattlerTagType.SKY_DROP, 1, move.id, user.id));
    // Clear the target's move queue
    target.getMoveQueue().splice(0, target.getMoveQueue().length);
    // Cancel any effects that force consecutive move use
    target.findAndRemoveTags((tag) => MOVE_LOCK_TAG_TYPES.includes(tag.tagType));
    return true;
  }

  /**
   * Sky Drop fails if:
   * - Gravity is active on the field
   * - The target is the user's ally
   * - The target's weight is 200 kg or more.
   * - The target is behind a substitute
   * - The target is semi-invulnerable (from Dig, etc.)
   * - The target is Commanding a Dondozo
   * - The target is immobilized by another Pokemon's Sky Drop
   */
  override getCondition(): MoveConditionFunc {
    return (user, target, move) =>
      failOnGravityCondition(user, target, move)
      && target.isPlayer() !== user.isPlayer()
      && target.species.weight < 200
      && !target.hasTag(...SEMI_INVULNERABLE_BATTLER_TAG_TYPES, BattlerTagType.SUBSTITUTE)
      && target.getAlly()?.getTag(BattlerTagType.COMMANDED)?.getSourcePokemon()?.id !== target.id
      && (!target.hasTag(BattlerTagType.SKY_DROP) || target.getTag(BattlerTagType.SKY_DROP)?.sourceId === user.id);
  }

  /**
   * @returns A {@linkcode MAJOR_EFFECT_SCORE_BONUS} if the user is faster than all of its opponents.
   * This effectively negates the penalty applied to charge moves under favorable conditions.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const oppAlly = target.getAlly();
    const canBypass =
      oppAlly?.isActive(true)
      && (user.hasAbilityWithAttr(AbAttrFlag.ALWAYS_HIT)
        || oppAlly.hasAbilityWithAttr(AbAttrFlag.ALWAYS_HIT)
        || oppAlly.hasTag(BattlerTagType.IGNORE_ACCURACY));

    return !canBypass && user.getOpponents().every((opp) => user.outspeeds(opp, true)) ? MAJOR_EFFECT_SCORE_BONUS : 0;
  }
}
