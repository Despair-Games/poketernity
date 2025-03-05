import {
  CritBoostBattlerTagTypes,
  DamagingTrappedBattlerTagTypes,
  FireSpinTrappedBattlerTagTypes,
  GulpMissileBattlerTagTypes,
  RemoveTypeBattlerTagTypes,
  SemiInvulnerableBattlerTagTypes,
  TrappedBattlerTagTypes,
  VortexTrappedBattlerTagTypes,
} from "#app/utils/battler-tag-type-utils";
import { describe, expect, it } from "vitest";

describe("Utils - Battler Tag Types Utils", () => {
  it("should have all arrays frozen", () => {
    expect(Object.isFrozen(SemiInvulnerableBattlerTagTypes)).toBe(true);
    expect(Object.isFrozen(CritBoostBattlerTagTypes)).toBe(true);
    expect(Object.isFrozen(RemoveTypeBattlerTagTypes)).toBe(true);
    expect(Object.isFrozen(FireSpinTrappedBattlerTagTypes)).toBe(true);
    expect(Object.isFrozen(VortexTrappedBattlerTagTypes)).toBe(true);
    expect(Object.isFrozen(DamagingTrappedBattlerTagTypes)).toBe(true);
    expect(Object.isFrozen(TrappedBattlerTagTypes)).toBe(true);
    expect(Object.isFrozen(GulpMissileBattlerTagTypes)).toBe(true);
  });
});
