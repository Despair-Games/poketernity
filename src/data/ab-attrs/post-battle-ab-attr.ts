import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostBattleAbAttr extends AbAttr {
  applyPostBattle(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}
