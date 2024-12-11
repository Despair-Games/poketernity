import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { nil, NumberHolder } from "#app/utils";
import type { Type } from "#enums/type";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

export class MoveTypeChangeAbAttr extends PreAttackAbAttr {
  constructor(
    private newType: Type,
    private powerMultiplier: number,
    private condition?: PokemonAttackCondition,
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
    args: any[],
  ): boolean {
    if (this.condition && this.condition(pokemon, defender, move)) {
      const moveType: NumberHolder | nil = args[0];
      const power: NumberHolder | nil = args[1];
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
