import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "#app/data/move";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { failOnGravityCondition } from "../move-conditions/fail-on-gravity-condition";
import { MoveEffectAttr } from "./move-effect-attr";
import { MoveLockTagTypes, SemiInvulnerableBattlerTagTypes } from "#app/utils/battler-tag-type-utils";

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
    target.findAndRemoveTags((tag) => MoveLockTagTypes.includes(tag.tagType));
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
      && !target.getTag(BattlerTagType.SUBSTITUTE)
      && !target.getTag(...SemiInvulnerableBattlerTagTypes)
      && target.getAlly()?.getTag(BattlerTagType.COMMANDED)?.getSourcePokemon()?.id !== target.id
      && (!target.getTag(BattlerTagType.SKY_DROP) || target.getTag(BattlerTagType.SKY_DROP)?.sourceId === user.id);
  }
}
