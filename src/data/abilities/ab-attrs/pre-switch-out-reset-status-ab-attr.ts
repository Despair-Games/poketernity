import type { Pokemon } from "#app/field/pokemon";
import { PreSwitchOutAbAttr } from "#app/data/abilities/ab-attrs/pre-switch-out-ab-attr";

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
