import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Pokemon } from "#app/field/pokemon";

export abstract class AbAttr {
  public showAbility: boolean;
  private extraCondition: AbAttrCondition;

  constructor(showAbility: boolean = true) {
    this.showAbility = showAbility;
  }

  /**
   * Applies the effects of this attribute
   * @param _pokemon The {@linkcode Pokemon} with the ability
   * @param _passive `true` if the source ability is a Pokemon's passive
   * @param _simulated `true` if attribute effects should be resolved without changing game state
   * @param _args Any additional parameters or data to modify
   * @returns `true` if this attribute applies successfully. If {@linkcode showAbility} is enabled,
   * and this apply call is not simulated, returning `true` activates the ability's flyout
   * and {@linkcode getTriggerMessage | trigger message} (if applicable)
   */
  apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, ..._args: unknown[]): boolean {
    return false;
  }

  getTriggerMessage(_pokemon: Pokemon, _abilityName: string, ..._args: any[]): string | null {
    return null;
  }

  getCondition(): AbAttrCondition | null {
    return this.extraCondition ?? null;
  }

  addCondition(condition: AbAttrCondition): AbAttr {
    this.extraCondition = condition;
    return this;
  }
}
