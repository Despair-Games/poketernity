import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Prevents the use of self-KO explosion moves / the activation of the ability Aftermath while the ability holder is on the field
 * Moves prevented include Self-Destruct, Explosion, Mind Blown, and Misty Explosion
 * The ability Aftermath's Japanese name means `Induced Explosion` which is why it is included here.
 * These abilities use this attribute:
 * - Damp
 */
export class FieldPreventExplosionLikeAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    cancelled.value = true;
    return simulated ? false : true;
  }
}
