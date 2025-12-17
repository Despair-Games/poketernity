import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";

/**
 * Attribute used when a move can deal damage to a pokemon with a specified {@linkcode BattlerTagType}.
 *
 * Moves that always hit but do not deal double damage: **Thunder**, **Fissure**, **Sky Uppercut**,
 * **Smack Down**, **Hurricane**, **Thousand Arrows**
 */
export class HitsTagAttr extends MoveAttr {
  /** The {@linkcode BattlerTagType} this move hits */
  public tagType: BattlerTagType;
  /** Should this move deal double damage against {@linkcode HitsTagAttr.tagType}? */
  public doubleDamage: boolean;

  constructor(tagType: BattlerTagType, doubleDamage: boolean = false) {
    super();

    this.tagType = tagType;
    this.doubleDamage = doubleDamage;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    if (target.hasTag(this.tagType)) {
      return this.doubleDamage ? 10 : 5;
    }
    return 0;
  }
}
