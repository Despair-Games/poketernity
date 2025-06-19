import { AbilityBattlerTag } from "#battler-tags/ability-battler-tag";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Tag used by {@link https://bulbapedia.bulbagarden.net/wiki/Unburden_(Ability) | Unburden}
 * to double the owner's Speed stat
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
