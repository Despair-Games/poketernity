import type { AbAttr } from "#abilities/ab-attr";
import { Ability } from "#abilities/ability";
import {
  AB_FLAG_BYPASS_FAINT,
  AB_FLAG_COPIABLE,
  AB_FLAG_IGNORABLE,
  AB_FLAG_PARTIAL,
  AB_FLAG_REPLACEABLE,
  AB_FLAG_SUPPRESSABLE,
  AB_FLAG_UNIMPLEMENTED,
  AB_FLAG_WORKS_WHEN_TRANSFORMED,
} from "#constants/ability-constants";
import type { AbilityId } from "#enums/ability-id";
import type { MoveId } from "#enums/move-id";
import type { AbAttrCondition } from "#types/ability-types";
import type { Constructor } from "#types/utility-types";

export class AbBuilder {
  public id: AbilityId;
  /** The generation the ability was introduced in */
  public generation: number;
  public flags: number;
  /** Determines priority bracket for post-summon ability activation */
  // TODO: implement its effects
  public postSummonPriority: number;
  public attrs: AbAttr[] = [];
  public conditions: AbAttrCondition[] = [];

  constructor(id: AbilityId, generation: number, postSummonPriority: number = 0) {
    this.id = id;
    this.generation = generation;
    this.postSummonPriority = postSummonPriority;
    this.flags = AB_FLAG_SUPPRESSABLE | AB_FLAG_COPIABLE | AB_FLAG_REPLACEABLE | AB_FLAG_WORKS_WHEN_TRANSFORMED;
  }

  /**
   * Construct the ability set by this builder
   * @returns A new {@linkcode Ability} instance with the parameters set in this builder.
   */
  public build(): Ability {
    // @ts-expect-error: Typescript doesn't support friend classes, but we only
    // want this builder to be able to create new abilities.
    return new Ability(this);
  }

  public attr<T extends Constructor<AbAttr>>(AttrType: T, ...args: ConstructorParameters<T>): this {
    const attr = new AttrType(...args);
    this.attrs.push(attr);

    return this;
  }

  public conditionalAttr<T extends Constructor<AbAttr>>(
    condition: AbAttrCondition,
    AttrType: T,
    ...args: ConstructorParameters<T>
  ): this {
    const attr = new AttrType(...args);
    attr.setCondition(condition);
    this.attrs.push(attr);

    return this;
  }

  /** Marks the ability as able to activate even if the ability holder faints. */
  public bypassFaint(): this {
    this.flags |= AB_FLAG_BYPASS_FAINT;
    return this;
  }

  /** Marks the ability as able to be ignored by effects like {@linkcode AbilityId.MOLD_BREAKER | Mold Breaker} */
  public ignorable(): this {
    this.flags |= AB_FLAG_IGNORABLE;
    return this;
  }

  /** Marks the ability as unable to be suppressed by effects like {@linkcode AbilityId.NEUTRALIZING_GAS | Neutralizing Gas} */
  public unsuppressable(): this {
    this.flags ^= AB_FLAG_SUPPRESSABLE;
    return this;
  }

  /** Marks the ability as unable to be copied by effects like {@linkcode MoveId.ROLE_PLAY | Role Play} */
  public uncopiable(): this {
    this.flags ^= AB_FLAG_COPIABLE;
    return this;
  }

  /** Marks the ability as unable to be replaced by effects like {@linkcode MoveId.SIMPLE_BEAM | Simple Beam} */
  public unreplaceable(): this {
    this.flags ^= AB_FLAG_REPLACEABLE;
    return this;
  }

  /** Marks the ability as unable to activate if the user is transformed (such as from {@linkcode MoveId.TRANSFORM | Transform}). */
  // TODO: implement the effects of this flag
  public noTransform(): this {
    this.flags ^= AB_FLAG_WORKS_WHEN_TRANSFORMED;
    return this;
  }

  public condition(condition: AbAttrCondition): this {
    this.conditions.push(condition);

    return this;
  }

  /** Marks the ability as being incomplete (missing functionality) in some way */
  public partial(): this {
    this.flags |= AB_FLAG_PARTIAL;
    return this;
  }

  /** Marks the ability as being unimplemented (no functionality) */
  public unimplemented(): this {
    this.flags |= AB_FLAG_UNIMPLEMENTED;
    return this;
  }

  /**
   * Internal flag used for developers to document edge cases. When using this, please be sure to document the edge case.
   * @returns the ability
   */
  public edgeCase(): this {
    return this;
  }
}
