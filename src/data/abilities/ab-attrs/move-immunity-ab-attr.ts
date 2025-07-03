import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PreDefendAbAttrCondition } from "#types/ability-types";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

export class MoveImmunityAbAttr extends PreDefendAbAttr {
  private readonly immuneCondition: PreDefendAbAttrCondition;

  constructor(immuneCondition: PreDefendAbAttrCondition) {
    super(true);
    this._flags.add(AbAttrFlag.MOVE_IMMUNITY);

    this.immuneCondition = immuneCondition;
  }

  public override apply(
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

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:moveImmunity", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
}
