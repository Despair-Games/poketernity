import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Move, AttackMove } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import i18next from "i18next";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

/**
 * Used by Wonder Guard
 * @extends TypeImmunityAbAttr
 */
export class NonSuperEffectiveImmunityAbAttr extends TypeImmunityAbAttr {
  constructor(condition?: AbAttrCondition) {
    super(null, condition);
  }

  override applyPreDefend(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const typeMultiplier: NumberHolder = args[0];

    if (move instanceof AttackMove && typeMultiplier.value < 2) {
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
