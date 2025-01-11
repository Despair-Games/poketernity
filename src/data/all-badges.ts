import { BadgeType } from "#enums/badge-type";
import { Type } from "#enums/type";
import { Badge } from "./badge";

export const allBadges: Badge[] = [];

export function initBadges() {
  // TODO: initialize all badges here
  allBadges.push(new Badge(BadgeType.BOULDER, "BoulderBadge", "TBD", 1, Type.ROCK));
}
