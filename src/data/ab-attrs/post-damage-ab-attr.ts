import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers after the Pokemon takes any damage
 * @extends AbAttr
 */
export class PostDamageAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean, _damage: number, _source?: Pokemon): boolean {
    return false;
  }
}
