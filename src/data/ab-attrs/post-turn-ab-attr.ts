import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostTurnAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): boolean {
    return false;
  }
}
