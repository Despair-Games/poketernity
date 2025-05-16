import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { isNil, type BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Prevents the use of self-KO explosion moves / the activation of the ability Aftermath while the ability holder is on the field
 * Moves prevented include Self-Destruct, Explosion, Mind Blown, and Misty Explosion
 * The ability Aftermath's Japanese name means `Induced Explosion` which is why it is included here.
 * These abilities use this attribute:
 * - Damp
 */
export class FieldPreventExplosionLikeAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.FIELD_PREVENT_EXPLOSION_LIKE);
  }

  /**
   * Applies the effects of the AbAttr when it is called in {@linkcode failIfDampCondition}
   * @param cancelled - A {@linkcode BooleanHolder} that determines if the move should fail
   * @param attacker - The {@linkcode Pokemon} using the move
   * @param move - The {@linkcode Move} being used
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    cancelled: BooleanHolder,
    _attacker: Pokemon,
    _move?: Move,
  ): boolean {
    cancelled.value = true;
    return true;
  }

  /**
   * UNUSED - Can be used once move conditional checking differentiates between simulated and non-simulated checks
   * Returns an ability activation message in cases where Damp prevents the usage of a move
   * @returns the appropriate trigger message or null
   */
  public override getTriggerMessage(_pokemon: Pokemon, _abilityName: string, ...args: any[]): string | null {
    /** @todo Remove casting when `args`' typing is changed to `unknown[]` */
    const [attacker, move]: [Pokemon, Move] = args as [Pokemon, Move];
    if (isNil(move)) {
      return null;
    }

    return i18next.t("moveTriggers:cannotUseMove", {
      pokemonName: getPokemonNameWithAffix(attacker),
      moveName: move.name,
    });
  }
}
