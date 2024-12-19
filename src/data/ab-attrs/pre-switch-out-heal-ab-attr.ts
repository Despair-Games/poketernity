import type { Pokemon } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils";
import { PreSwitchOutAbAttr } from "./pre-switch-out-ab-attr";

export class PreSwitchOutHealAbAttr extends PreSwitchOutAbAttr {
  override applyPreSwitchOut(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
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
