import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute that grants {@link https://bulbapedia.bulbagarden.net/wiki/Semi-invulnerable_turn | semi-invulnerability} to the user during
 * the associated move's charging phase. Should only be used for {@linkcode ChargingMove | ChargingMoves} as a `chargeAttr`.
 * @extends MoveEffectAttr
 */
export class SemiInvulnerableAttr extends MoveEffectAttr {
  /** The type of {@linkcode SemiInvulnerableTag} to grant to the user */
  public tagType: BattlerTagType;

  constructor(tagType: BattlerTagType) {
    super(true);
    this.tagType = tagType;
  }

  /**
   * Grants a {@linkcode SemiInvulnerableTag} to the associated move's user.
   * @param user the {@linkcode Pokemon} using the move
   * @param target n/a
   * @param move the {@linkcode Move} being used
   * @param args n/a
   * @returns `true` if semi-invulnerability was successfully granted; `false` otherwise.
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    return user.addTag(this.tagType, 1, move.id, user.id);
  }
}
