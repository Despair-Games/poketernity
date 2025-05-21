import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

export class IntimidateImmunityAbAttr extends AbAttr {
  protected readonly hasTriggerMessage: boolean;

  constructor(hasTriggerMessage: boolean = true) {
    super(false);
    this.hasTriggerMessage = hasTriggerMessage;

    this._flags.add(AbAttrFlag.INTIMIDATE_IMMUNITY);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    if (!cancelled.value) {
      cancelled.value = true;
      return true;
    }
    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    if (this.hasTriggerMessage) {
      return i18next.t("abilityTriggers:intimidateImmunity", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        abilityName,
      });
    }
    return "";
  }
}
