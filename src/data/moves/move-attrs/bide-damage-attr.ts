import type { BideTag } from "#app/data/battler-tags/bide-tag";
import type { Move } from "#app/data/moves/move";
import { FixedDamageAttr } from "#app/data/moves/move-attrs/fixed-damage-attr";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Attribute to modify damage according to Bide's "stored energy."
 * On the last turn of execution, Bide deals damage equal to double the
 * attack damage received during the storing turns.
 * @extends FixedDamageAttr
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
