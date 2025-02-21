import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { AbAttr } from "./ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class BlockItemTheftAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.BLOCK_ITEM_THEFT);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]) {
    return i18next.t("abilityTriggers:blockItemTheft", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
