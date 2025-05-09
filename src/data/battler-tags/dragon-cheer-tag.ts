import { CritBoostTag } from "#battler-tags/crit-boost-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";

/**
 * Tag for the effects of Dragon Cheer, which boosts the critical hit ratio of the user's ally.
 * @extends CritBoostTag
 */
export class DragonCheerTag extends CritBoostTag {
  /** The types of the user's ally when the tag is added */
  public typesOnAdd: ElementalType[];

  constructor() {
    super(BattlerTagType.CRIT_BOOST, MoveId.DRAGON_CHEER);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    this.typesOnAdd = pokemon.getTypes(true);
  }
}
