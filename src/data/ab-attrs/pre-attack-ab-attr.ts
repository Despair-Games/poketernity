import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PreAttackAbAttr extends AbAttr {
  applyPreAttack(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _defender: Pokemon | null,
    _move: Move,
    _args: any[],
  ): boolean {
    return false;
  }
}
