import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils/common-utils";
import i18next from "i18next";
import { AbAttr } from "./ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class IntimidateImmunityAbAttr extends AbAttr {
  protected readonly hasTriggerMessage: boolean;

  constructor(hasTriggerMessage: boolean = true) {
    super(false);
    this.hasTriggerMessage = hasTriggerMessage;

    this._flags.add(AbAttrFlag.INTIMIDATE_IMMUNITY);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    if (!cancelled.value) {
      cancelled.value = true;
      return true;
    }
    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    if (this.hasTriggerMessage) {
      return i18next.t("abilityTriggers:intimidateImmunity", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        abilityName,
      });
    }
    return "";
  }
}
