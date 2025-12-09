import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

export class IntimidateImmunityAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IntimidateImmunityAbAttr";
  protected readonly hasTriggerMessage: boolean;

  constructor(hasTriggerMessage: boolean = true) {
    super(hasTriggerMessage);
    this.hasTriggerMessage = hasTriggerMessage;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }

  public override canApply(...[, , cancelled]: Parameters<this["apply"]>): boolean {
    return !cancelled.value;
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
