import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type Move from "../move";
import { AbAttr } from "./ab-attr";

export class PreDefendAbAttr extends AbAttr {
  applyPreDefend(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move | null,
    _cancelled: BooleanHolder | null,
    _args: any[],
  ): boolean {
    return false;
  }
}
