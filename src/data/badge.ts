import type { Localizable } from "#app/interfaces/locales";
import type { BadgeType } from "#enums/badge-type";
import type { Type } from "#enums/type";

/**
 * Badges are key items that are given to the player and affect the run
 *
 * @param id the corresponding BadgeType enum
 * @param name the name of the badge
 * @param effect the description of what the badge does
 * @param generation which generation the badge originated
 * @param type the pokemon type associated with the badge
 * @param powerLevel a way to tweak how effective a badge is
 */
export abstract class Badge implements Localizable {
  public id: BadgeType;
  public name: string;
  public effect: string;
  public generation: number;
  public type: Type;
  public powerLevel: number;

  localize(): void {
    // TODO: FILL IN
    this.name = "";
    this.effect = "";
  }
}
