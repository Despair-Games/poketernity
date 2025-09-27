import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";

export class PreSwitchOutHealAbAttr extends PreSwitchOutAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      const healAmount = toDmgValue(pokemon.getMaxHp() * 0.33);
      pokemon.heal(healAmount);
      pokemon.updateInfo();
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return !pokemon.isFullHp();
  }
}
