import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { RemoveTypeBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";

/**
 * Tag representing the secondary effect of {@link https://bulbapedia.bulbagarden.net/wiki/Roost_(move) | Roost}.
 * Removes Flying type from the owner for the rest of the turn.
 * @extends BattlerTag
 */
export class RoostedTag extends BattlerTag {
  private isBaseFlying: boolean;
  private isBasePureFlying: boolean;

  constructor() {
    super(BattlerTagType.ROOSTED, BattlerTagLapseType.TURN_END, 1, MoveId.ROOST);
  }

  override onRemove(pokemon: Pokemon): void {
    const currentTypes = pokemon.getTypes();
    const baseTypes = pokemon.getTypes(false, false, true);

    const forestsCurseApplied: boolean =
      currentTypes.includes(ElementalType.GRASS) && !baseTypes.includes(ElementalType.GRASS);
    const trickOrTreatApplied: boolean =
      currentTypes.includes(ElementalType.GHOST) && !baseTypes.includes(ElementalType.GHOST);

    if (this.isBaseFlying) {
      let modifiedTypes: ElementalType[] = [];
      if (this.isBasePureFlying) {
        if (forestsCurseApplied || trickOrTreatApplied) {
          modifiedTypes = currentTypes.filter((type) => type !== ElementalType.NORMAL);
          modifiedTypes.push(ElementalType.FLYING);
        } else {
          modifiedTypes = [ElementalType.FLYING];
        }
      } else {
        modifiedTypes = [...currentTypes];
        modifiedTypes.push(ElementalType.FLYING);
      }
      pokemon.summonData.types = modifiedTypes;
      pokemon.updateInfo();
    }
  }

  override onAdd(pokemon: Pokemon): void {
    const currentTypes = pokemon.getTypes();
    const baseTypes = pokemon.getTypes(false, false, true);

    const isOriginallyDualType = baseTypes.length === 2;
    const isCurrentlyDualType = currentTypes.length === 2;
    this.isBaseFlying = baseTypes.includes(ElementalType.FLYING);
    this.isBasePureFlying = baseTypes[0] === ElementalType.FLYING && baseTypes.length === 1;

    if (this.isBaseFlying) {
      let modifiedTypes: ElementalType[];
      if (this.isBasePureFlying && !isCurrentlyDualType) {
        modifiedTypes = [ElementalType.NORMAL];
      } else {
        if (pokemon.hasTag(...RemoveTypeBattlerTagTypes) && isOriginallyDualType && !isCurrentlyDualType) {
          modifiedTypes = [ElementalType.UNKNOWN];
        } else {
          modifiedTypes = currentTypes.filter((type) => type !== ElementalType.FLYING);
        }
      }
      pokemon.summonData.types = modifiedTypes;
      pokemon.updateInfo();
    }
  }
}
