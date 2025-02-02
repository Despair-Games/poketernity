import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementType } from "#enums/element-type";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

export class TypeImmunityAddBattlerTagAbAttr extends TypeImmunityAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;

  constructor(immuneType: ElementType, tagType: BattlerTagType, turnCount: number, condition?: AbAttrCondition) {
    super(immuneType, condition);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    typeMultiplier: NumberHolder,
  ): boolean {
    const ret = super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);

    if (ret) {
      cancelled.value = true; // Suppresses "No Effect" message
      if (!simulated) {
        pokemon.addTag(this.tagType, this.turnCount, undefined, pokemon.id);
      }
    }

    return ret;
  }
}
