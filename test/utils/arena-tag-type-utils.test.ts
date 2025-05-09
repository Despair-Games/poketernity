import {
  CONDITIONAL_PROTECT_ARENA_TAG_TYPES,
  ENTRY_HAZARD_ARENA_TAG_TYPES,
  WEAKEN_MOVE_SCREEN_ARENA_TAG_TYPES,
  WEAKEN_MOVE_TYPE_ARENA_TAG_TYPES,
} from "#constants/arena-tag-constants";
import { describe, expect, it } from "vitest";

describe("Utils - Arena Tag Type Utils", () => {
  it("should have all arrays frozen", () => {
    expect(Object.isFrozen(WEAKEN_MOVE_TYPE_ARENA_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(ENTRY_HAZARD_ARENA_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(WEAKEN_MOVE_SCREEN_ARENA_TAG_TYPES)).toBe(true);
    expect(Object.isFrozen(CONDITIONAL_PROTECT_ARENA_TAG_TYPES)).toBe(true);
  });
});
