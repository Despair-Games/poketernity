import type { BadgeGrade } from "#enums/badge-grade";
import type { BadgeType } from "#enums/badge-type";
import type { ElementalType } from "#enums/elemental-type";
import i18next from "i18next";
import { KeyItem } from "item/key-item";

export class Badge extends KeyItem {
  public id: BadgeType;
  public generation: number;
  public type: ElementalType;
  public grade: BadgeGrade;

  constructor(localeKey, iconImage, id, generation, type) {
    super(localeKey, iconImage);
    this.id = id;
    this.generation = generation;
    this.type = type;
  }

  override get name(): string {
    return i18next.t(`${this.localeKey}.name` as any);
  }

  override get description(): string {
    return i18next.t(`${this.localeKey}.${this.grade}.description` as any);
  }
}
