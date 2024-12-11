import type Pokemon from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostTurnAbAttr extends AbAttr {
  applyPostTurn(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}
