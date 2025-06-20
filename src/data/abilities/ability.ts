import type { AbAttr } from "#abilities/ab-attr";
import type { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import type { AbAttrCondition } from "#types/ab-attr-condition";
import type { Constructor } from "#types/constructor";
import { toCamelCaseString } from "#utils/string-utils";
import i18next from "i18next";

export class Ability {
  public id: AbilityId;

  private nameAppend: string;
  public generation: number;
  public isBypassFaint: boolean;
  public isIgnorable: boolean;
  public attrs: AbAttr[];
  public conditions: AbAttrCondition[];

  constructor(id: AbilityId, generation: number) {
    this.id = id;

    this.nameAppend = "";
    this.generation = generation;
    this.attrs = [];
    this.conditions = [];
  }

  /**
   * The ability's localized name. May include a {@linkcode nameAppend | tag}
   * if the ability isn't fully implemented.
   */
  public get name(): string {
    return this.id ? `${i18next.t(`ability:${this.i18nKey}.name`)}${this.nameAppend}` : "";
  }

  /** The ability's localized description. */
  public get description(): string {
    return this.id ? i18next.t(`ability:${this.i18nKey}.description`) : "";
  }

  /**
   * The i18n key for this ability in camel-case, i.e. "abilityName".
   * Used to localize the ability's {@linkcode name} and {@linkcode description}.
   */
  private get i18nKey(): string {
    return toCamelCaseString(AbilityId[this.id]);
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

  bypassFaint(): Ability {
    this.isBypassFaint = true;
    return this;
  }

  ignorable(): Ability {
    this.isIgnorable = true;
    return this;
  }

  condition(condition: AbAttrCondition): Ability {
    this.conditions.push(condition);

    return this;
  }

  partial(): this {
    this.nameAppend += " (P)";
    return this;
  }

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
