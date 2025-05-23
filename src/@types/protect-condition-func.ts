import type { MoveId } from "#enums/move-id";

/**
 * A function to check if a move with the given {@linkcode MoveId}
 * can have its effects negated by a {@linkcode ConditionalProtectTag | conditional protection}
 * field effect (e.g. Wide Guard).
 */
export type ProtectConditionFunc = (moveId: MoveId) => boolean;
