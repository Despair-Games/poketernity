import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

export class PreventBerryUseAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.PREVENT_BERRY_USE);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _target: Pokemon,
    cancelled: ValueHolder<boolean>,
  ): void {
    cancelled.value = true;
  }

  public override getTriggerMessage(_pokemon: Pokemon, _abilityName: string, target: Pokemon): string {
    return i18next.t("abilityTriggers:preventBerryUse", { pokemonNameWithAffix: getPokemonNameWithAffix(target) });
  }
}
