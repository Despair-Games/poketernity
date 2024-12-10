import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type Pokemon from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import i18next from "i18next";
import { type Move, AttackMove } from "../move";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

export class NonSuperEffectiveImmunityAbAttr extends TypeImmunityAbAttr {
  constructor(condition?: AbAttrCondition) {
    super(null, condition);
  }

  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const modifierValue =
      args.length > 0
        ? (args[0] as NumberHolder).value
        : pokemon.getAttackTypeEffectiveness(attacker.getMoveType(move), attacker, undefined, undefined, move);

    if (move instanceof AttackMove && modifierValue < 2) {
      cancelled.value = true; // Suppresses "No Effect" message
      (args[0] as NumberHolder).value = 0;
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
