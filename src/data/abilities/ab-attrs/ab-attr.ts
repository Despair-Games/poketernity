import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Pokemon } from "#app/field/pokemon";
import type { Ability } from "#app/data/abilities/ability";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export abstract class AbAttr {
  /** A set of flags for this attribute. Cascaded top to bottom. */
  protected _flags: Set<AbAttrFlag> = new Set();
  public source: Ability;
  public showAbility: boolean;
  public showAbilityInstant: boolean;
  private extraCondition: AbAttrCondition;

  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    this._flags.add(AbAttrFlag.UNSPECIFIED);
    this.showAbility = showAbility;
    this.showAbilityInstant = showAbilityInstant;
  }

  /**
   * Checks if this attribute has the provided {@linkcode AbAttrFlag}.
   * @param flag The {@linkcode AbAttrFlag} to check
   * @returns true if the attribute has the flag
   */
  hasFlag(flag: AbAttrFlag) {
    return this._flags.has(flag);
  }

  /**
   * Applies the effects of this attribute
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param simulated `true` if attribute effects should be resolved without changing game state
   * @param args Any additional parameters or data to modify
   * @returns `true` if this attribute applies successfully. If {@linkcode showAbility} is enabled,
   * and this apply call is not simulated, returning `true` activates the ability's flyout
   * and {@linkcode getTriggerMessage | trigger message} (if applicable)
   */
  apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): boolean {
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
