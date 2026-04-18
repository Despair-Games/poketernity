import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

export class BlockItemTheftAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockItemTheftAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string) {
    return i18next.t("abilityTriggers:blockItemTheft", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
