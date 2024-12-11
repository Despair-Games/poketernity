import { type HitResult, type Pokemon } from "#app/field/pokemon";
import type Move from "../move";
import { AbAttr } from "./ab-attr";

export class PostDefendAbAttr extends AbAttr {
  applyPostDefend(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _hitResult: HitResult | null,
    _args: any[],
  ): boolean {
    return false;
  }
}
