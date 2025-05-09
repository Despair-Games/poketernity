import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils/common-utils";

export class PreSwitchOutHealAbAttr extends PreSwitchOutAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!pokemon.isFullHp()) {
      if (!simulated) {
        const healAmount = toDmgValue(pokemon.getMaxHp() * 0.33);
        pokemon.heal(healAmount);
        pokemon.updateInfo();
      }

      return true;
    }

    return false;
  }
}
