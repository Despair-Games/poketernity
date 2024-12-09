import type Pokemon from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostBattleInitAbAttr extends AbAttr {
  applyPostBattleInit(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}
