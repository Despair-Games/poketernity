import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/pokemon-attack-condition";
import type { NumberHolder } from "#utils/common-utils";

export class MoveTypeChangeAbAttr extends PreAttackAbAttr {
  constructor(
    private readonly newType: ElementalType,
    private readonly powerMultiplier: number,
    private readonly condition?: PokemonAttackCondition,
  ) {
    super(true);
    this._flags.add(AbAttrFlag.MOVE_TYPE_CHANGE);
  }

  // TODO: Decouple this into two attributes (type change / power boost)
  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    defender?: Pokemon,
    moveType?: NumberHolder,
    power?: NumberHolder,
  ): boolean {
    if (this.condition?.(pokemon, defender, move)) {
      if (moveType) {
        moveType.value = this.newType;
      }
      if (power) {
        power.value *= this.powerMultiplier;
      }
      return true;
    }

    return false;
  }
}
