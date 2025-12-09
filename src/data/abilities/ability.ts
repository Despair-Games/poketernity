import type { AbAttr } from "#abilities/ab-attr";
import type { AbBuilder } from "#abilities/ab-builder";
import {
  AB_FLAG_BYPASS_FAINT,
  AB_FLAG_COPIABLE,
  AB_FLAG_IGNORABLE,
  AB_FLAG_PARTIAL,
  AB_FLAG_REPLACEABLE,
  AB_FLAG_SUPPRESSABLE,
  AB_FLAG_SWAPPABLE,
  AB_FLAG_UNIMPLEMENTED,
  AB_FLAG_WORKS_WHEN_TRANSFORMED,
} from "#constants/ability-constants";
import { AbilityId } from "#enums/ability-id";
// biome-ignore lint/correctness/noUnusedImports: TSDoc import
import type { MoveId } from "#enums/move-id";
import type { AbAttrCondition, AbAttrKey, AbAttrMap } from "#types/ability-types";
import { toCamelCaseString } from "#utils/string-utils";
import i18next from "i18next";

export class Ability {
  public id: AbilityId;
  /** The generation the ability was introduced in. */
  public generation: number;
  /** The ability's localized name. May include " (P)" or " (N)" if the ability isn't fully implemented. */
  public readonly name: string;
  /** The ability's localized description. */
  public readonly description: string;
  /** Determines priority bracket for post-summon ability activation. */
  // TODO: implement its effects
  public postSummonPriority: number;
  public attrs: AbAttr[] = [];
  public conditions: AbAttrCondition[] = [];
  private readonly flags: number;

  private constructor(builder: AbBuilder) {
    this.id = builder.id;

    /**
     * The i18n key for this ability in camel-case, i.e. `"abilityName"`.
     * Used to localize the ability's `name` and `description`.
     */
    const i18nKey: string = toCamelCaseString(AbilityId[this.id]);
    let nameAppend = "";
    if (this.partial) {
      nameAppend = " (P)";
    } else if (this.unimplemented) {
      nameAppend = " (N);";
    }
    this.name = this.id ? `${i18next.t(`ability:${i18nKey}.name`)}${nameAppend}` : "";
    this.description = this.id ? i18next.t(`ability:${i18nKey}.description`) : "";

    this.generation = builder.generation;
    this.postSummonPriority = builder.postSummonPriority;
    this.attrs = builder.attrs;
    this.conditions = builder.conditions;
    this.flags = builder.flags;

    for (const attr of this.attrs) {
      attr.source = this;
    }
  }

  /** Whether the ability will activate even if the pokemon faints. */
  public get bypassFaint(): boolean {
    return (this.flags & AB_FLAG_BYPASS_FAINT) > 0;
  }

  /** Whether the ability can be ignored by effects like {@linkcode AbilityId.MOLD_BREAKER | Mold Breaker}. */
  public get ignorable(): boolean {
    return (this.flags & AB_FLAG_IGNORABLE) > 0;
  }

  /** Whether the ability can be suppressed by effects like {@linkcode AbilityId.NEUTRALIZING_GAS | Neutralizing Gas}. */
  public get suppressable(): boolean {
    return (this.flags & AB_FLAG_SUPPRESSABLE) > 0;
  }

  /** Whether the ability can be copied by effects like {@linkcode MoveId.ROLE_PLAY | Role Play}. */
  public get copiable(): boolean {
    return (this.flags & AB_FLAG_COPIABLE) > 0;
  }

  /** Whether the ability can be replaced by effects like {@linkcode MoveId.SIMPLE_BEAM | Simple Beam}. */
  public get replaceable(): boolean {
    return (this.flags & AB_FLAG_REPLACEABLE) > 0;
  }

  /**
   * Whether the ability can be swapped by effects like {@linkcode MoveId.SKILL_SWAP}.
   * @remarks
   * This is `true` if the ability is both {@linkcode copiable} and {@linkcode replaceable}.
   */
  public get swappable(): boolean {
    return (this.flags & AB_FLAG_SWAPPABLE) > 0;
  }

  /** Whether the ability will activate if the pokemon is transformed (such as by {@linkcode MoveId.TRANSFORM | Transform}). */
  // TODO: implement the effects of this flag
  public get worksWhenTransformed(): boolean {
    return (this.flags & AB_FLAG_WORKS_WHEN_TRANSFORMED) > 0;
  }

  /** Whether the ability is incomplete (missing functionality) in some way. */
  public get partial(): boolean {
    return (this.flags & AB_FLAG_PARTIAL) > 0;
  }

  /** Whether the ability is unimplemented (no functionality). */
  public get unimplemented(): boolean {
    return (this.flags & AB_FLAG_UNIMPLEMENTED) > 0;
  }

  /**
   * Get all ability attributes that match the given {@linkcode key}
   * @param key - The {@linkcode AbAttrKey} to check for
   * @returns An array of attributes that match the given {@linkcode key} (can be empty if none match).
   */
  getAttrs<K extends AbAttrKey>(key: K): AbAttrMap[K][] {
    // TODO: Find out if it's possible to remove `as AbAttrMap[K][]`.
    // It's likely required due to `apply` and `canApply` not following LSP.
    return this.attrs.filter((abAttr): abAttr is AbAttrMap[K] => abAttr.is(key)) as AbAttrMap[K][];
  }

  /**
   * Check if an ability has an attribute that matches the given {@linkcode key}
   * @param key - The {@linkcode AbAttrKey} to check
   * @returns Whether the ability has an attribute with a matching key
   */
  hasAttr<K extends AbAttrKey>(key: K): boolean {
    return this.attrs.some((abAttr) => abAttr.is(key));
  }
}
