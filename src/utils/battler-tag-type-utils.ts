import { BattlerTagType } from "#enums/battler-tag-type";

export const SemiInvulnerableBattlerTagTypes = Object.freeze([
  BattlerTagType.FLYING,
  BattlerTagType.UNDERGROUND,
  BattlerTagType.UNDERWATER,
  BattlerTagType.HIDDEN,
]);

export const MoveLockTagTypes = Object.freeze([BattlerTagType.FRENZY]);

export const CritBoostBattlerTagTypes = Object.freeze([BattlerTagType.CRIT_BOOST, BattlerTagType.DRAGON_CHEER]);

export const RemoveTypeBattlerTagTypes = Object.freeze([BattlerTagType.BURNED_UP, BattlerTagType.DOUBLE_SHOCKED]);

export const FireSpinTrappedBattlerTagTypes = Object.freeze([BattlerTagType.FIRE_SPIN, BattlerTagType.G_MAX_FIRE_SPIN]);

export const VortexTrappedBattlerTagTypes = Object.freeze([
  BattlerTagType.WHIRLPOOL,
  ...FireSpinTrappedBattlerTagTypes,
]);

export const DamagingTrappedBattlerTagTypes = Object.freeze([
  BattlerTagType.BIND,
  BattlerTagType.WRAP,
  BattlerTagType.CLAMP,
  BattlerTagType.SAND_TOMB,
  BattlerTagType.G_MAX_SAND_TOMB,
  BattlerTagType.MAGMA_STORM,
  BattlerTagType.SNAP_TRAP,
  BattlerTagType.THUNDER_CAGE,
  BattlerTagType.INFESTATION,
  ...VortexTrappedBattlerTagTypes,
]);

export const TrappedBattlerTagTypes = Object.freeze([
  BattlerTagType.TRAPPED,
  BattlerTagType.NO_RETREAT,
  BattlerTagType.OCTOLOCK,
  BattlerTagType.INGRAIN,
  ...DamagingTrappedBattlerTagTypes,
]);

export const GulpMissileBattlerTagTypes = Object.freeze([
  BattlerTagType.GULP_MISSILE_ARROKUDA,
  BattlerTagType.GULP_MISSILE_PIKACHU,
]);
