import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Type } from "#enums/type";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

export class MoveTypeChangeAbAttr extends PreAttackAbAttr {
  constructor(
    private readonly newType: Type,
    private readonly powerMultiplier: number,
    private readonly condition?: PokemonAttackCondition,
  ) {
    super(true);
  }

  // TODO: Decouple this into two attributes (type change / power boost)
  override applyPreAttack(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    defender: Pokemon,
    move: Move,
    moveType: NumberHolder,
    power: NumberHolder,
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
