import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostFaintAbAttr extends AbAttr {
  applyPostFaint(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker?: Pokemon,
    _move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    return false;
  }
}
