import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import type { Pokemon } from "#app/field/pokemon";

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
