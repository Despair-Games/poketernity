import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { AbAttr } from "./ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class IntimidateImmunityAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.INITIMIDATE_IMMUNITY);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:intimidateImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
