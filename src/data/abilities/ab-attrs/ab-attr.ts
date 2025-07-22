/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ShowAbilityPhase } from "#phases/show-ability-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { Ability } from "#abilities/ability";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { AbAttrCondition } from "#types/ability-types";

export abstract class AbAttr {
  /** A set of flags for this attribute. Cascaded top to bottom. */
  protected _flags: Set<AbAttrFlag> = new Set();
  /** The {@linkcode Ability} to which this attribute belongs */
  public source: Ability;
  /**
   * If `true`, shows a flyout for the source Ability whenever
   * this attribute successfully applies
   */
  public showAbility: boolean;
  /**
   * If `true`, and {@linkcode showAbility} is also `true`, the Ability flyout
   * will be shown immediately after the attribute applies instead of
   * as a {@linkcode ShowAbilityPhase}
   */
  public showAbilityInstant: boolean;
  /**
   * A condition for the attribute to apply.
   * Can be set by {@linkcode Ability.conditionalAttr}
   */
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
  public hasFlag(flag: AbAttrFlag) {
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
  public apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): boolean {
    return false;
  }

  /**
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param abilityName - The localized name of the {@linkcode Ability} with this attribute
   * @param args - Additional parameters for the trigger message. **NOTE**: This should be a subset
   * of the additional parameters (i.e. `args`) given in {@linkcode apply}.
   * @returns A message to play when the ability applies successfully, or `null` if no message should play.
   */
  public getTriggerMessage(_pokemon: Pokemon, _abilityName: string, ..._args: unknown[]): string | null {
    return null;
  }

  /**
   * @returns this attribute's condition to apply. By default, this checks if the attribute
   * has a set {@linkcode extraCondition} and returns it if so.
   */
  public getCondition(): AbAttrCondition | null {
    return this.extraCondition ?? null;
  }

  /**
   * Adds a condition to this attribute. If the condition isn't met,
   * the attribute will not apply its effects.
   * @param condition - The {@linkcode AbAttrCondition | condition} to add
   * @returns `this`
   * @see {@linkcode Ability.conditionalAttr}
   */
  public setCondition(condition: AbAttrCondition): this {
    this.extraCondition = condition;
    return this;
  }
}
