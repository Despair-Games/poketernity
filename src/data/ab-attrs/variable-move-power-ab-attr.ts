import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

export class VariableMovePowerAbAttr extends PreAttackAbAttr {
  override applyPreAttack(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    _power: NumberHolder,
  ): boolean {
    return false;
  }
}
