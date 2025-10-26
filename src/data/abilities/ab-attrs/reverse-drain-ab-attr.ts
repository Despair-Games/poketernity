import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Ability attribute to make incoming drain moves deal damage to the user instead of healing them.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Liquid_Ooze_(Ability) | Liquid Ooze}.
 */
export class ReverseDrainAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ReverseDrainAbAttr";

  constructor() {
    super(true);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    reversed: ValueHolder<boolean>,
  ): void {
    reversed.value = true;
  }

  public override getTriggerMessage(_pokemon: Pokemon, _abilityName: string, attacker: Pokemon): string {
    return i18next.t("abilityTriggers:reverseDrain", { pokemonNameWithAffix: getPokemonNameWithAffix(attacker) });
  }
}
