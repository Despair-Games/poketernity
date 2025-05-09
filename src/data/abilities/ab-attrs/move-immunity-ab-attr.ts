import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import type { PreDefendAbAttrCondition } from "#app/@types/PreDefendAbAttrCondition";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils/common-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import i18next from "i18next";

export class MoveImmunityAbAttr extends PreDefendAbAttr {
  private readonly immuneCondition: PreDefendAbAttrCondition;

  constructor(immuneCondition: PreDefendAbAttrCondition) {
    super(true);
    this._flags.add(AbAttrFlag.MOVE_IMMUNITY);

    this.immuneCondition = immuneCondition;
  }

  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
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
