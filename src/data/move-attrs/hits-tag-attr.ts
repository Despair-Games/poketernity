import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute used when a move can deal damage to {@linkcode BattlerTagType}
 * Moves that always hit but do not deal double damage: Thunder, Fissure, Sky Uppercut,
 * Smack Down, Hurricane, Thousand Arrows
 * @extends MoveAttr
 */
export class HitsTagAttr extends MoveAttr {
  /** The {@linkcode BattlerTagType} this move hits */
  public tagType: BattlerTagType;
  /** Should this move deal double damage against {@linkcode HitsTagAttr.tagType}? */
  public doubleDamage: boolean;

  constructor(tagType: BattlerTagType, doubleDamage: boolean = false) {
    super();

    this.tagType = tagType;
    this.doubleDamage = !!doubleDamage;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    return target.getTag(this.tagType) ? (this.doubleDamage ? 10 : 5) : 0;
  }
}
