import {
  CRIT_BOOST_BATTLER_TAG_TYPES,
  DAMAGING_TRAPPED_BATTLER_TAG_TYPES,
  FIRE_SPIN_TRAPPED_BATTLER_TAG_TYPES,
  GULP_MISSILE_BATTLER_TAG_TYPES,
  REMOVE_TYPE_BATTLER_TAG_TYPES,
  SEMI_INVULNERABLE_BATTLER_TAG_TYPES,
  TRAPPED_BATTLER_TAG_TYPES,
  VORTEX_TRAPPED_BATTLER_TAG_TYPES,
} from "#constants/battler-tag-constants";
import { describe, expect, it } from "vitest";

describe("Utils - Battler Tag Types Utils", () => {
  it("should have all arrays frozen", () => {
    expect(Object.isFrozen(SEMI_INVULNERABLE_BATTLER_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(CRIT_BOOST_BATTLER_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(REMOVE_TYPE_BATTLER_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(FIRE_SPIN_TRAPPED_BATTLER_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(VORTEX_TRAPPED_BATTLER_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(DAMAGING_TRAPPED_BATTLER_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(TRAPPED_BATTLER_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(GULP_MISSILE_BATTLER_TAG_TYPES)).toBe(true);
  });
});
