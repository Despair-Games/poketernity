import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

export class IntimidateImmunityAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IntimidateImmunityAbAttr";

  protected readonly hasTriggerMessage: boolean;

  constructor(hasTriggerMessage: boolean = true) {
    super(hasTriggerMessage);

    this.hasTriggerMessage = hasTriggerMessage;
  }

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ cancelled }: Parameters<this["apply"]>[0]): boolean {
    return !cancelled.value;
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    if (this.hasTriggerMessage) {
      return i18next.t("abilityTriggers:intimidateImmunity", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        abilityName,
      });
    }
    return "";
  }
}
