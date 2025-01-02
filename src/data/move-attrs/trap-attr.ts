import type { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Attribute to add a binding effect to the target.
 * While bound, the target is trapped and takes damage at the end of each turn.
 * @extends AddBattlerTagAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Category:Binding_moves Binding moves}
 */
export class TrapAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, { turnCountMin: 4, turnCountMax: 5 });
  }
}
