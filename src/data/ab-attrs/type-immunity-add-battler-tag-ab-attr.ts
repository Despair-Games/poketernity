import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Type } from "#enums/type";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

export class TypeImmunityAddBattlerTagAbAttr extends TypeImmunityAbAttr {
  private tagType: BattlerTagType;
  private turnCount: number;

  constructor(immuneType: Type, tagType: BattlerTagType, turnCount: number, condition?: AbAttrCondition) {
    super(immuneType, condition);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  override applyPreDefend(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const ret = super.applyPreDefend(pokemon, passive, simulated, attacker, move, cancelled, args);

    if (ret) {
      cancelled.value = true; // Suppresses "No Effect" message
      if (!simulated) {
        pokemon.addTag(this.tagType, this.turnCount, undefined, pokemon.id);
      }
    }

    return ret;
  }
}
