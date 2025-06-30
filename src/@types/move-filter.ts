import type { MoveId } from "#enums/move-id";

/**
 * A function to filter moves based on their properties.
 * @param moveId - The {@linkcode MoveId} of the move to evaluate
 * @returns `true` if the filter applies to the given move
 */
export type MoveFilter = (moveId: MoveId) => boolean;
