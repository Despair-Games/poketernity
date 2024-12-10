import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { BattlerTagType } from "#app/enums/battler-tag-type";
import type { Type } from "#app/enums/type";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type Move from "../move";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

export class TypeImmunityAddBattlerTagAbAttr extends TypeImmunityAbAttr {
  private tagType: BattlerTagType;
  private turnCount: integer;

  constructor(immuneType: Type, tagType: BattlerTagType, turnCount: integer, condition?: AbAttrCondition) {
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
