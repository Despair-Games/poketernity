import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Prevents the use of self-KO explosion moves / the activation of the ability Aftermath while the ability holder is on the field
 * Moves prevented include Self-Destruct, Explosion, Mind Blown, and Misty Explosion
 * The ability Aftermath's Japanese name means `Induced Explosion` which is why it is included here.
 * These abilities use this attribute:
 * - Damp
 */
export class FieldPreventExplosionLikeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "FieldPreventExplosionLikeAbAttr";
  private moveUser: string;
  private moveName: string;

  constructor() {
    super(true);
  }

  /**
   * Applies the effects of the AbAttr when it is called in {@linkcode failIfDampCondition}
   * @param cancelled a {@linkcode BooleanHolder} that determines if the move should fail
   * @param args[0] contains the name of the move's user
   * @param args[1] contains the move's name if present
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    cancelled: ValueHolder<boolean>,
    moveUser: string,
    moveName: string,
  ): void {
    this.moveUser = moveUser;
    this.moveName = moveName;
    cancelled.value = true;
  }

  /**
   * UNUSED - Can be used once move conditional checking differentiates between simulated and non-simulated checks
   * Returns an ability activation message in cases where Damp prevents the usage of a move
   * @returns the appropriate trigger message or null
   */
  _getTriggerMessage(_pokemon: Pokemon, _abilityName: string, ..._args: any[]): string | null {
    if (this.moveUser && this.moveName) {
      const message = i18next.t("moveTriggers:cannotUseMove", { pokemonName: this.moveUser, moveName: this.moveName });
      return message;
    }
    return null;
  }
}
