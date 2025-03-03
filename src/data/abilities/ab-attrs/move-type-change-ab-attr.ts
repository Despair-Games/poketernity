import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementalType } from "#enums/elemental-type";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

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
    if (this.condition && this.condition(pokemon, defender, move)) {
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
