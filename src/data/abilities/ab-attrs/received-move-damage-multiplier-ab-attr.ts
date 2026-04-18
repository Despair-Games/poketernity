import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import type { ReceivedMoveDamageMultiplierAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonDefendCondition } from "#types/move-types";

export class ReceivedMoveDamageMultiplierAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "ReceivedMoveDamageMultiplierAbAttr";

  protected readonly condition: PokemonDefendCondition;
  private readonly damageMultiplier: number;

  constructor(condition: PokemonDefendCondition, damageMultiplier: number, showAbility: boolean = false) {
    super(showAbility);

    this.condition = condition;
    this.damageMultiplier = damageMultiplier;
  }

  public override apply({ multiplier }: ReceivedMoveDamageMultiplierAbAttrParams): void {
    multiplier.value *= this.damageMultiplier;
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, attacker, move);
  }
}
