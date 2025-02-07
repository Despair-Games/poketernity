import { BattlerTagType } from "#enums/battler-tag-type";

export const SemiInvulnerableBattlerTagTypes = [
  BattlerTagType.FLYING,
  BattlerTagType.UNDERGROUND,
  BattlerTagType.UNDERWATER,
  BattlerTagType.HIDDEN,
];

export const CritBoostBattlerTagTypes = [BattlerTagType.CRIT_BOOST, BattlerTagType.DRAGON_CHEER];

export const RemoveTypeBattlerTagTypes = [BattlerTagType.BURNED_UP, BattlerTagType.DOUBLE_SHOCKED];

export const FireSpinTrappedBattlerTagTypes = [BattlerTagType.FIRE_SPIN, BattlerTagType.G_MAX_FIRE_SPIN];

export const VortexTrappedBattlerTagTypes = [BattlerTagType.WHIRLPOOL, ...FireSpinTrappedBattlerTagTypes];

export const DamagingTrappedBattlerTagTypes = [
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
];

export const TrappedBattlerTagTypes = [
  BattlerTagType.TRAPPED,
  BattlerTagType.NO_RETREAT,
  BattlerTagType.OCTOLOCK,
  BattlerTagType.INGRAIN,
  ...DamagingTrappedBattlerTagTypes,
];

export const GulpMissileBattlerTagTypes = [BattlerTagType.GULP_MISSILE_ARROKUDA, BattlerTagType.GULP_MISSILE_PIKACHU];
