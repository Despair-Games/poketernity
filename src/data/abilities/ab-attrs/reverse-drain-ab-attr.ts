import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { ReverseDrainAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * Ability attribute to make incoming drain moves deal damage to the user instead of healing them.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Liquid_Ooze_(Ability)}.
 */
export class ReverseDrainAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ReverseDrainAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ reversed }: ReverseDrainAbAttrParams): void {
    reversed.value = true;
  }

  public override getTriggerMessage({ attacker }: Parameters<this["apply"]>[0]): string {
    return i18next.t("abilityTriggers:reverseDrain", { pokemonNameWithAffix: getPokemonNameWithAffix(attacker) });
  }
}
