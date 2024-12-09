import { type Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";

type AbAttrCondition = (pokemon: Pokemon) => boolean;

export abstract class AbAttr {
  public showAbility: boolean;
  private extraCondition: AbAttrCondition;

  constructor(showAbility: boolean = true) {
    this.showAbility = showAbility;
  }

  apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder | null,
    _args: any[],
  ): boolean {
    return false;
  }

  getTriggerMessage(_pokemon: Pokemon, _abilityName: string, ..._args: any[]): string | null {
    return null;
  }

  getCondition(): AbAttrCondition | null {
    return this.extraCondition || null;
  }

  addCondition(condition: AbAttrCondition): AbAttr {
    this.extraCondition = condition;
    return this;
  }
}
