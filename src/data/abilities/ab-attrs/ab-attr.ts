import type { Ability } from "#abilities/ability";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import type { AbAttrCondition, AbAttrKey, AbAttrMap } from "#types/ability-types";
import type { Exact } from "#types/utility-types";

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
  // TODO: make default to `() => true` instead of `undefined`/`null`
  private extraCondition: AbAttrCondition;

  constructor(showAbility: boolean = false) {
    this.showAbility = showAbility;
  }

  public is<K extends AbAttrKey>(abAttrKey: K): this is AbAttrMap[K] {
    return this.abAttrKey === abAttrKey;
  }

  /**
   * Apply ability effects without checking conditions.
   * @remarks
   * **Never call this method directly**, use {@linkcode applyAbAttrs} instead.
   */
  public apply(_params: BaseAbAttrParams): void {}

  // The `Exact` in the next two signatures enforces that the
  // type of the _params operand is always compatible with the type of apply.
  // This allows fewer fields, but never a type with more.

  /**
   * Determines whether or not this attribute's effect can be applied in the current game state.
   * @remarks
   * This is meant to use the same parameters as {@linkcode apply},
   * and should always be run before `apply` is called.
   * @returns Whether this attribute's effect can be applied
   */
  public canApply(_params: Exact<Parameters<this["apply"]>[0]>): boolean {
    return true;
  }

  /**
   * @returns A message to play when the ability applies successfully, or `null` if no message should play.
   */
  public getTriggerMessage(_params: Exact<Parameters<this["apply"]>[0]>, _abilityName: string): string | null {
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
  public setCondition(condition: AbAttrCondition): void {
    this.extraCondition = condition;
  }
}
