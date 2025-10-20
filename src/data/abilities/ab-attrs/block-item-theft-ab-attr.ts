import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

export class BlockItemTheftAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.BLOCK_ITEM_THEFT);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string) {
    return i18next.t("abilityTriggers:blockItemTheft", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
