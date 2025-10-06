import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import type { Pokemon } from "#field/pokemon";

export class PreSwitchOutResetStatusAbAttr extends PreSwitchOutAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      pokemon.resetStatus();
      pokemon.updateInfo();
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return pokemon.hasNonVolatileStatusEffect(false, true);
  }
}
