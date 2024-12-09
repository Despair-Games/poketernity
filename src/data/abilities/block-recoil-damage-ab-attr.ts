import type Pokemon from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { AbAttr } from "./ab-attr";

export class BlockRecoilDamageAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    cancelled.value = true;

    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]) {
    return i18next.t("abilityTriggers:blockRecoilDamage", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      abilityName: abilityName,
    });
  }
}
