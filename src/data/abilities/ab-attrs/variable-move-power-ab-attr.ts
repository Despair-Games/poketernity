import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { VariableMovePowerAbAttrParams } from "#types/ab-attr-param-types";

export abstract class VariableMovePowerAbAttr extends PreAttackAbAttr {
  protected override readonly abAttrKey = "VariableMovePowerAbAttr";

  public abstract override apply(params: VariableMovePowerAbAttrParams): void;
}
