import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostKnockOutAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean, _knockedOutPokemon: Pokemon, ..._args: unknown[]): boolean {
    return false;
  }
}
