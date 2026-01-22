import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export class PreSwitchOutResetStatusAbAttr extends PreSwitchOutAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      pokemon.resetStatus();
      pokemon.updateInfo();
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.hasNonVolatileStatusEffect(false, true);
  }
}
