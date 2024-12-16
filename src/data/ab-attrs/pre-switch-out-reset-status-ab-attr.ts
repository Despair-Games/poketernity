import type { Pokemon } from "#app/field/pokemon";
import { PreSwitchOutAbAttr } from "./pre-switch-out-ab-attr";

export class PreSwitchOutResetStatusAbAttr extends PreSwitchOutAbAttr {
  override applyPreSwitchOut(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (pokemon.status) {
      if (!simulated) {
        pokemon.resetStatus();
        pokemon.updateInfo();
      }

      return true;
    }

    return false;
  }
}
