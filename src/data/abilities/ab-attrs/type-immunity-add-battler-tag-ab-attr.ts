import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrCondition } from "#types/ability-types";
import type { ValueHolder } from "#utils/common-utils";

export class TypeImmunityAddBattlerTagAbAttr extends TypeImmunityAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;

  constructor(immuneType: ElementalType, tagType: BattlerTagType, turnCount: number, condition?: AbAttrCondition) {
    super(immuneType, condition);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: ValueHolder<boolean>,
    typeMultiplier: ValueHolder<number>,
  ): void {
    super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount, undefined, pokemon.id);
    }
  }

  // The added battler tag supplies the trigger message instead
  public override getTriggerMessage(_pokemon: Pokemon, _abilityName: string): string | null {
    return null;
  }
}
