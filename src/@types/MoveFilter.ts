import type { MoveId } from "#enums/move-id";

export type MoveFilter = (moveId: MoveId) => boolean;
