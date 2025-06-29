export enum BattlerIndex {
  ATTACKER = -1,
  PLAYER,
  PLAYER_2,
  ENEMY,
  ENEMY_2,
  PLAYER_SIDE,
  ENEMY_SIDE,
  BOTH_SIDES,
}

export const FIELD_BATTLER_INDEXES = [
  BattlerIndex.PLAYER,
  BattlerIndex.PLAYER_2,
  BattlerIndex.ENEMY,
  BattlerIndex.ENEMY_2,
] as const;
export type FieldBattlerIndex = (typeof FIELD_BATTLER_INDEXES)[number];
