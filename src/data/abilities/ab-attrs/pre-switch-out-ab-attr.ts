import { AbAttr } from "#abilities/ab-attr";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PreSwitchOutAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PreSwitchOutAbAttr";

  public abstract override apply({ pokemon, simulated }: BaseAbAttrParams): void;
}
