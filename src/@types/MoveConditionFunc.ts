import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * A function representing a {@linkcode Move | Move's} condition.
 * @param user - The {@linkcode Pokemon} using the move
 * @param target - The {@linkcode Pokemon} targeted by the move
 * @param move - The {@linkcode Move} being used
 * @param simulated - (Optional) If `true`, suppresses changes to game state
 * @returns `true` if the condition is satisfied in the given battle state
 */
export type MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move, simulated?: boolean) => boolean;
