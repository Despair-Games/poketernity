import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

export class BlockRecoilDamageAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.BLOCK_RECOIL_DAMAGE);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string) {
    return i18next.t("abilityTriggers:blockRecoilDamage", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      abilityName: abilityName,
    });
  }
}
