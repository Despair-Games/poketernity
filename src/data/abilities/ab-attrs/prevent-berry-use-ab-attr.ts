import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { PreventBerryUseAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

export class PreventBerryUseAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PreventBerryUseAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ cancelled }: PreventBerryUseAbAttrParams): void {
    cancelled.value = true;
  }

  public override getTriggerMessage({ target }: Parameters<this["apply"]>[0]): string {
    return i18next.t("abilityTriggers:preventBerryUse", { pokemonNameWithAffix: getPokemonNameWithAffix(target) });
  }
}
