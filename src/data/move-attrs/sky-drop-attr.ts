import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SemiInvulnerableTag, SkyDropTag } from "../battler-tags";
import type { Move } from "../move";
import { type MoveConditionFunc, failOnGravityCondition } from "../move-conditions";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Attribute implementing the charging phase effects of {@link https://bulbapedia.bulbagarden.net/wiki/Sky_Drop_(move) | Sky Drop}.
 * Grants semi-invulnerability to the user and target and immobilizes the target.
 */
export class SkyDropAttr extends MoveEffectAttr {
  /**
   * Makes the user and target semi-invulnerable, immobilizes the target,
   * and removes all of the target's queued moves (including Frenzy moves).
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args?: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    // Add Sky Drop tag to both user and target
    [user, target].forEach((p) => p.addTag(BattlerTagType.SKY_DROP, 1, move.id, user.id));
    // Clear the target's move queue
    target.getMoveQueue().splice(0, target.getMoveQueue().length);
    // Remove Frenzy from the target, if applicable
    target.removeTag(BattlerTagType.FRENZY);
    return true;
  }

  /**
   * Sky Drop fails if:
   * - Gravity is active on the field
   * - The target is the user's ally
   * - The target's weight is 200 kg or more.
   * - The target is behind a substitute
   * - The target is semi-invulnerable (from Dig, etc.)
   * - The target is immobilized by another Pokemon's Sky Drop
   */
  override getCondition(): MoveConditionFunc {
    return (user, target, move) =>
      failOnGravityCondition(user, target, move)
      && target.isPlayer() !== user.isPlayer()
      && target.species.weight < 200
      && !target.getTag(BattlerTagType.SUBSTITUTE)
      && !target.getTag(SemiInvulnerableTag)
      && (!target.getTag(SkyDropTag) || target.getTag(SkyDropTag)?.sourceId === user.id);
  }
}
