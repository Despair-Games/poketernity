import {
  EntryHazardArenaTagTypes,
  ConditionalProtectArenaTagTypes,
  WeakenMoveScreenArenaTagTypes,
  WeakenMoveTypeArenaTagTypes,
} from "#app/utils/arena-tag-type-utils";
import { describe, expect, it } from "vitest";

describe("Utils - Arena Tag Type Utils", () => {
  it("should have all arrays frozen", () => {
    expect(Object.isFrozen(WeakenMoveTypeArenaTagTypes)).toBe(true);
    expect(Object.isFrozen(EntryHazardArenaTagTypes)).toBe(true);
    expect(Object.isFrozen(WeakenMoveScreenArenaTagTypes)).toBe(true);
    expect(Object.isFrozen(ConditionalProtectArenaTagTypes)).toBe(true);
  });
});
