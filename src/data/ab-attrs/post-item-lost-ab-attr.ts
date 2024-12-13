import type Pokemon from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers after the Pokemon loses or consumes an item
 * @extends AbAttr
 */
export class PostItemLostAbAttr extends AbAttr {
  applyPostItemLost(_pokemon: Pokemon, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}
