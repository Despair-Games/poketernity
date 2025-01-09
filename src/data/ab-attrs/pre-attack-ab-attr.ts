import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PreAttackAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _defender: Pokemon | null,
    _move: Move,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
