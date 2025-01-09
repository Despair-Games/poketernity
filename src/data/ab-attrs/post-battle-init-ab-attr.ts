import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostBattleInitAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean): boolean {
    return false;
  }
}
