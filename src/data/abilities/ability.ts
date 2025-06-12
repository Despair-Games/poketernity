// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MoveId } from "#enums/move-id";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { AbAttr } from "#abilities/ab-attr";
import type { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import type { AbAttrCondition } from "#types/ab-attr-condition";
import type { Constructor } from "#types/constructor";
import type { Localizable } from "#types/locales";
import i18next from "i18next";

export class Ability implements Localizable {
  public id: AbilityId;

  private nameAppend: string = "";
  public name: string;
  public description: string;
  public generation: number;
  /**
   * If `true`, the ability will activate even if the pokemon faints.
   * @defaultValue `false`
   */
  public isBypassFaint: boolean = false;
  /**
   * If `true`, the ability can be ignored by effects like {@linkcode AbilityId.MOLD_BREAKER | Mold Breaker}.
   * @defaultValue `false`
   */
  public isIgnorable: boolean = false;
  /**
   * If `true`, the ability can be suppressed by effects like {@linkcode AbilityId.NEUTRALIZING_GAS | Neutralizing Gas}.
   * @defaultValue `true`
   */
  public isSuppressable: boolean = true;
  /**
   * If `true`, the ability can be copied by effects like {@linkcode MoveId.ROLE_PLAY | Role Play}.
   * @defaultValue `true`
   */
  public isCopiable: boolean = true;
  /**
   * If `true`, the ability can be replaced by effects like {@linkcode MoveId.ROLE_PLAY | Role Play}.
   * @defaultValue `true`
   */
  public isReplaceable: boolean = true;
  /**
   * If `true`, the ability will activate if the pokemon is transformed (such as by {@linkcode MoveId.TRANSFORM | Transform}).
   * @defaultValue `true`
   * @todo Implement the effects of the flag
   */
  public worksWhenTransformed: boolean = true;
  public attrs: AbAttr[] = [];
  public conditions: AbAttrCondition[] = [];

  constructor(id: AbilityId, generation: number) {
    this.id = id;
    this.generation = generation;

    this.localize();
  }

  /** @returns `true` if both {@linkcode isCopiable} and {@linkcode isReplaceable} are `true` */
  public get isSwappable(): boolean {
    return this.isCopiable && this.isReplaceable;
  }

  localize(): void {
    const i18nKey = AbilityId[this.id]
      .split("_")
      .filter((f) => f)
      .map((f, i) => (i ? `${f[0]}${f.slice(1).toLowerCase()}` : f.toLowerCase()))
      .join("") as string;

    this.name = this.id ? `${i18next.t(`ability:${i18nKey}.name`) as string}${this.nameAppend}` : "";
    this.description = this.id ? (i18next.t(`ability:${i18nKey}.description`) as string) : "";
  }

  /**
   * Get all ability attributes that match the given {@linkcode flag}
   * @param flag The {@linkcode AbAttrFlag} to check for
   * @returns Array of attributes that match the given {@linkcode flag}, Empty Array if none match.
   */
  getAttrs<T extends AbAttr>(flag: AbAttrFlag): T[] {
    return this.attrs.filter((abAttr): abAttr is T => abAttr.hasFlag(flag));
  }

  /**
   * Check if an ability has an attribute that matches {@linkcode flag}
   * @param flag The {@linkcode AbAttrFlag} to check
   * @returns true if the ability has an attribute with the given {@linkcode flag}
   */
  hasAttrFlag(flag: AbAttrFlag): boolean {
    return this.attrs.some((abAttr) => abAttr.hasFlag(flag));
  }

  attr<T extends Constructor<AbAttr>>(AttrType: T, ...args: ConstructorParameters<T>): Ability {
    const attr = new AttrType(...args);
    attr.source = this;
    this.attrs.push(attr);

    return this;
  }

  conditionalAttr<T extends Constructor<AbAttr>>(
    condition: AbAttrCondition,
    AttrType: T,
    ...args: ConstructorParameters<T>
  ): Ability {
    const attr = new AttrType(...args);
    attr.source = this;
    attr.setCondition(condition);
    this.attrs.push(attr);

    return this;
  }

  /** Marks the ability as able to activate even if the ability holder faints. */
  bypassFaint(): Ability {
    this.isBypassFaint = true;
    return this;
  }

  /** Marks the ability as able to be ignored by effects like {@linkcode AbilityId.MOLD_BREAKER | Mold Breaker} */
  ignorable(): Ability {
    this.isIgnorable = true;
    return this;
  }

  /** Marks the ability as unable to be suppressed by effects like {@linkcode AbilityId.NEUTRALIZING_GAS | Neutralizing Gas} */
  unsuppressable(): Ability {
    this.isSuppressable = false;
    return this;
  }

  /** Marks the ability as unable to be copied by effects like {@linkcode MoveId.ROLE_PLAY | Role Play} */
  uncopiable(): Ability {
    this.isCopiable = false;
    return this;
  }

  /** Marks the ability as unable to be replaced by effects like {@linkcode MoveId.SIMPLE_BEAM | Simple Beam} */
  unreplaceable(): Ability {
    this.isReplaceable = false;
    return this;
  }

  /**
   * Marks the ability as unable to activate if the user is transformed (such as from {@linkcode MoveId.TRANSFORM | Transform}).
   * @todo Implement the effects of this flag
   */
  noTransform(): Ability {
    this.worksWhenTransformed = false;
    return this;
  }

  condition(condition: AbAttrCondition): Ability {
    this.conditions.push(condition);

    return this;
  }

  /** Marks the ability as being incomplete (missing functionality) in some way */
  partial(): this {
    this.nameAppend += " (P)";
    return this;
  }

  /** Marks the ability as being unimplemented (no functionality) */
  unimplemented(): this {
    this.nameAppend += " (N)";
    return this;
  }

  /**
   * Internal flag used for developers to document edge cases. When using this, please be sure to document the edge case.
   * @returns the ability
   */
  edgeCase(): this {
    return this;
  }
}
