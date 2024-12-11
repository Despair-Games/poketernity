import type Pokemon from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostKnockOutAbAttr extends AbAttr {
  applyPostKnockOut(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _knockedOut: Pokemon,
    _args: any[],
  ): boolean {
    return false;
  }
}
