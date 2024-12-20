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
  /**
   * Applies the effects of the AbAttr when it is called in @linkcode {failIfDampCondition}
   * @param cancelled a booleanHolder object that determines if the move should fail
   * @param args[0] contains a booleanHolder object that determines if the move is simulated or not
   * @returns
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const simulatedCheck = args[0] as BooleanHolder;
    simulatedCheck.value = simulated ?? false;
    cancelled.value = true;
    return true;
  }
}
