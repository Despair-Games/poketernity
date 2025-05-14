import type { MoveId } from "#enums/move-id";

export type ProtectConditionFunc = (moveId: MoveId) => boolean;
