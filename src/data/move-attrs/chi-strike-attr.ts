import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "../move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Attribute to add a {@linkcode BattlerTagType.CRIT_BOOST_STACKABLE} to a Pokemon
 * and its ally
 * @extends MoveEffectAttr
 * @see {@linkcode BattlerTag}
 */
export class ChiStrikeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.CRIT_BOOST_STACKABLE, true);
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    user.addTag(this.tagType);

    if (user.getAlly()?.isActive(true)) {
      user.getAlly().addTag(this.tagType);
    }

    return true;
  }

  override getTagTargetBenefitScore(): number {
    return 5;
  }
}
