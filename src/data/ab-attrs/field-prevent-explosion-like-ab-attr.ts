import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";
import i18next from "i18next";

/**
 * Prevents the use of self-KO explosion moves / the activation of the ability Aftermath while the ability holder is on the field
 * Moves prevented include Self-Destruct, Explosion, Mind Blown, and Misty Explosion
 * The ability Aftermath's Japanese name means `Induced Explosion` which is why it is included here.
 * These abilities use this attribute:
 * - Damp
 */
export class FieldPreventExplosionLikeAbAttr extends AbAttr {
  private moveUser: string | null;
  private moveName: string | null;
  /**
   * Applies the effects of the AbAttr when it is called in @linkcode {failIfDampCondition}
   * @param cancelled a booleanHolder object that determines if the move should fail
   * @param args[0] contains the name of the move's user
   * @param args[1] contains the move's name if present
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    this.moveUser = args[0] ?? null;
    this.moveName = args[1] ?? null;
    cancelled.value = true;
    return true;
  }

  /**
   * Returns an ability activation message in cases where Damp prevents the usage of a move
   * @returns the appropriate trigger message or null
   */
  override getTriggerMessage(_pokemon: Pokemon, _abilityName: string, ..._args: any[]): string | null {
    if (this.moveUser && this.moveName) {
      return i18next.t("moveTriggers:cannotUseMove", { pokemonName: this.moveUser, moveName: this.moveName });
    }
    return null;
  }
}
