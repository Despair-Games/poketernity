import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute that grants {@link https://bulbapedia.bulbagarden.net/wiki/Semi-invulnerable_turn | semi-invulnerability} to the user during
 * the associated move's charging phase.
 *
 * Should only be used for {@linkcode ChargingMove | charge moves} via `.chargeAttr()`.
 */
export class SemiInvulnerableAttr extends MoveEffectAttr {
  /** The type of {@linkcode SemiInvulnerableTag} to grant to the user */
  public tagType: BattlerTagType;

  constructor(tagType: BattlerTagType) {
    super(true);
    this.tagType = tagType;
  }

  public override applyEffect(user: Pokemon, _target: Pokemon, move: Move): boolean {
    return user.addTag(this.tagType, 1, move.id, user.id);
  }

  /**
   * @returns A {@linkcode MINOR_EFFECT_SCORE_BONUS} if the following conditions apply:
   * - The user is faster than all of its active opponents
   * - All opponents cannot bypass the effects of semi-invulnerability (e.g. via No Guard)
   *
   * This effectively halves the penalty applied to charge moves under favorable conditions.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const opponents = user.getOpponents();
    /**
     * @todo
     * - This will detect opponents' No Guard even when it hasn't been revealed yet
     * - Opponents' Lock On is counted even when the opponent "locked on" to another Pokemon
     */
    const canBypass =
      [user, ...opponents].some((p) => p.hasAbilityWithAttr(AbAttrFlag.ALWAYS_HIT))
      || opponents.some((opp) => opp.hasTag(BattlerTagType.IGNORE_ACCURACY));

    return !canBypass && opponents.every((opp) => user.outspeeds(opp, true)) ? MINOR_EFFECT_SCORE_BONUS : 0;
  }
}
