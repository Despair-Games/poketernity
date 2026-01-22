import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue } from "#utils/common-utils";

export class PreSwitchOutHealAbAttr extends PreSwitchOutAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }
    const healAmount = toDmgValue(pokemon.getMaxHp() * 0.33);
    pokemon.heal(healAmount);
    pokemon.updateInfo();
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return !pokemon.isFullHp();
  }
}
