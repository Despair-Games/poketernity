import type { Ability } from "#abilities/ability";
import type { Pokemon } from "#field/pokemon";
import type { AbAttrCondition, AbAttrKey, AbAttrMap } from "#types/ability-types";

export abstract class AbAttr {
  /**
   * A `string` identifier for this attribute's type. When attributes
   * are {@link apply | applied}, they are looked up using this key.
   */
  protected abstract readonly abAttrKey: AbAttrKey;
  /** The {@linkcode Ability} to which this attribute belongs */
  public source: Ability;
  /**
   * If `true`, shows a flyout for the source Ability whenever
   * this attribute successfully applies
   */
  public showAbility: boolean;
  /**
   * A condition for the attribute to apply.
   * Can be set by {@linkcode Ability.conditionalAttr}
   */
  private extraCondition: AbAttrCondition;

  constructor(showAbility: boolean = false) {
    this.showAbility = showAbility;
  }

  public is<K extends AbAttrKey>(abAttrKey: K): this is AbAttrMap[K] {
    return this.abAttrKey === abAttrKey;
  }

  /**
   * Applies the effects of this attribute.
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param simulated `true` if attribute effects should be resolved without changing game state
   * @param args Any additional parameters or data to modify
   */
  public apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): void {}

  /**
   * Determines whether or not this attribute's effect can be applied in the current game state.
   * @remarks
   * This is meant to use the same parameters as {@linkcode apply},
   * and should always be run before `apply` is called.
   * @returns Whether this attribute's effect can be applied
   */
  public canApply(..._params: Parameters<this["apply"]>) {
    return true;
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
