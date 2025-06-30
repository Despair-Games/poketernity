import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Condition function for moves that can only be used on the
 * user's first turn on the field, e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Fake_Out_(move) | Fake Out}.
 * @param user - The {@linkcode Pokemon} using the move
 * @param _target - (Unused) The {@linkcode Pokemon} targeted by the move
 * @param _move - (Unused) The {@linkcode Move} being used
 * @returns `true` if the condition is met
 */
export const firstMoveCondition: MoveConditionFunc = (user, _target, _move) => user.summonData.waveTurnCount === 1;
