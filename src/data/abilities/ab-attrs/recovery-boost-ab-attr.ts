import { AbAttr } from "#abilities/ab-attr";
import type { RecoveryBoostAbAttrParams } from "#types/ab-attr-param-types";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Ability attribute that boosts a move's recovery by a certain factor if it meets specific conditions
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Mega_Launcher_(Ability) | Mega Launcher (Bulbapedia)}
 */
export class RecoveryBoostAbAttr extends AbAttr {
  protected override readonly abAttrKey = "RecoveryBoostAbAttr";

  private readonly condition: MoveConditionFunc;
  private readonly recoveryMultiplier: number;

  constructor(condition: MoveConditionFunc, recoveryMultiplier: number) {
    super();

    this.condition = condition;
    this.recoveryMultiplier = recoveryMultiplier;
  }

  public override apply({ healRatio }: RecoveryBoostAbAttrParams): void {
    healRatio.value *= this.recoveryMultiplier;
  }

  public override canApply({ pokemon, move, defender }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, defender, move);
  }
}
