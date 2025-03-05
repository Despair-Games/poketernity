import type { Pokemon } from "#app/field/pokemon";
import { PreSwitchOutAbAttr } from "./pre-switch-out-ab-attr";

export class PreSwitchOutResetStatusAbAttr extends PreSwitchOutAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (pokemon.hasNonVolatileStatusEffect()) {
      if (!simulated) {
        pokemon.resetStatus();
        pokemon.updateInfo();
      }

      return true;
    }

    return false;
  }
}
