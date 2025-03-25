import { AbilityBattlerTag } from "#app/data/battler-tags/ability-battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Tag used by {@link https://bulbapedia.bulbagarden.net/wiki/Unburden_(Ability) | Unburden}
 * to double the owner's Speed stat
 * @extends AbilityBattlerTag
 */
export class UnburdenTag extends AbilityBattlerTag {
  constructor() {
    super(BattlerTagType.UNBURDEN, AbilityId.UNBURDEN, BattlerTagLapseType.CUSTOM, 1);
  }
  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
  }
  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);
  }
}
