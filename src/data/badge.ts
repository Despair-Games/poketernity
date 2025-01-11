import type { BadgeGrade } from "#enums/badge-grades";
import type { BadgeType } from "#enums/badge-type";
import type { Type } from "#enums/type";
import i18next from "i18next";

/**
 * Badges are key items that are given to the player and affect the run
 *
 * @param id the corresponding BadgeType enum
 * @param localeKey the locale key of the badge
 * @param iconImage the string representation of the image
 * @param generation which generation the badge originated
 * @param type the pokemon type associated with the badge
 * @param grade a way to tweak how effective a badge is
 */
export class Badge {
  public id: BadgeType;
  public localeKey: string;
  public iconImage: string;
  public generation: number;
  public type: Type;
  public grade: BadgeGrade;

  constructor(id: BadgeType, localeKey: string, iconImage: string, generation: number, type: Type) {
    this.id = id;
    this.localeKey = localeKey;
    this.iconImage = iconImage;
    this.generation = generation;
    this.type = type;
  }

  getName(): string {
    return i18next.t(`${this.localeKey}.name` as any);
  }

  getDescription(): string {
    return i18next.t(`${this.localeKey}.description` as any);
  }
}
