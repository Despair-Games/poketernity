import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * Tag used to allow moves that interact with {@link MoveId.MINIMIZE} to function.
 * @extends BattlerTag
 */
export class MinimizeTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.MINIMIZED, BattlerTagLapseType.TURN_END, 1, MoveId.MINIMIZE);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isMax();
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    //If a pokemon dynamaxes they lose minimized status
    if (pokemon.isMax()) {
      return false;
    }
    return lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);
  }
}
