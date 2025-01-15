import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Reduces the damage dealt to an allied Pokemon. Used by Friend Guard.
 * @extends PreDefendAbAttr
 */
export class AlliedFieldDamageReductionAbAttr extends PreDefendAbAttr {
  private readonly damageMultiplier: number;

  constructor(damageMultiplier: number) {
    super();
    this.damageMultiplier = damageMultiplier;
  }

  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    multiplier: NumberHolder,
  ): boolean {
    multiplier.value *= this.damageMultiplier;
    return true;
  }
}
