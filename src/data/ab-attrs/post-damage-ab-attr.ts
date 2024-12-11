import type Pokemon from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers after the Pokemon takes any damage
 * @extends AbAttr
 */
export class PostDamageAbAttr extends AbAttr {
  public applyPostDamage(
    _pokemon: Pokemon,
    _damage: number,
    _passive: boolean,
    _simulated: boolean,
    _args: any[],
    _source?: Pokemon,
  ): boolean {
    return false;
  }
}
