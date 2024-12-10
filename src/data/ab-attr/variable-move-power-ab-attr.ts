import type Pokemon from "#app/field/pokemon";
import type Move from "../move";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

export class VariableMovePowerAbAttr extends PreAttackAbAttr {
  override applyPreAttack(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    _args: any[],
  ): boolean {
    //const power = args[0] as Utils.NumberHolder;
    return false;
  }
}
