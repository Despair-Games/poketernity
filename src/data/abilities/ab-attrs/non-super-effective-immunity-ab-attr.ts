import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrCondition } from "#types/AbAttrCondition";
import type { BooleanHolder, NumberHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Used by Wonder Guard
 * @extends TypeImmunityAbAttr
 */
export class NonSuperEffectiveImmunityAbAttr extends TypeImmunityAbAttr {
  constructor(condition?: AbAttrCondition) {
    super(null, condition);
  }

  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    typeMultiplier: NumberHolder,
  ): boolean {
    if (move.isAttackMove() && typeMultiplier.value < 2) {
      cancelled.value = true; // Suppresses "No Effect" message
      typeMultiplier.value = 0;
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:nonSuperEffectiveImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
