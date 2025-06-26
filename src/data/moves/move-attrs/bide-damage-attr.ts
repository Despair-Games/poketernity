import type { BideTag } from "#battler-tags/bide-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to modify damage according to Bide's "stored energy."
 * On the last turn of execution, Bide deals damage equal to double the
 * attack damage received during the storing turns.
 * @see {@linkcode BideTag}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Bide_(move) | Bide}
 */
export class BideDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  public override getDamage(user: Pokemon, _target: Pokemon, _move: Move): number {
    const bideTag = user.getTag<BideTag>(BattlerTagType.BIDE);
    return bideTag?.attackDamage ?? 0;
  }
}
