import type Pokemon from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import type Move from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

//#region Types

type PreDefendAbAttrCondition = (pokemon: Pokemon, attacker: Pokemon, move: Move) => boolean;

//#endregion

export class MoveImmunityAbAttr extends PreDefendAbAttr {
  private immuneCondition: PreDefendAbAttrCondition;

  constructor(immuneCondition: PreDefendAbAttrCondition) {
    super(true);

    this.immuneCondition = immuneCondition;
  }

  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (this.immuneCondition(pokemon, attacker, move)) {
      cancelled.value = true;
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:moveImmunity", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
}
