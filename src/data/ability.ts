import type { Localizable } from "#app/interfaces/locales";
import type { Constructor } from "#app/utils";
import { Abilities } from "#enums/abilities";
import i18next from "i18next";
import type { AbAttr } from "./ab-attrs/ab-attr";
import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { AbAttrFlag } from "#enums/ab-attr-flag";

export class Ability implements Localizable {
  public id: Abilities;

  private nameAppend: string;
  public name: string;
  public description: string;
  public generation: number;
  public isBypassFaint: boolean;
  public isIgnorable: boolean;
  public attrs: AbAttr[];
  public conditions: AbAttrCondition[];

  constructor(id: Abilities, generation: number) {
    this.id = id;

    this.nameAppend = "";
    this.generation = generation;
    this.attrs = [];
    this.conditions = [];

    this.localize();
  }

  localize(): void {
    const i18nKey = Abilities[this.id]
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
    attr.addCondition(condition);
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
