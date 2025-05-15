import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrCondition } from "#types/AbAttrCondition";
import type { BooleanHolder, NumberHolder } from "#utils/common-utils";

export class TypeImmunityAddBattlerTagAbAttr extends TypeImmunityAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;

  constructor(immuneType: ElementalType, tagType: BattlerTagType, turnCount: number, condition?: AbAttrCondition) {
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
