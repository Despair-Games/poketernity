import type { MoveConditionFunc } from "#types/MoveConditionFunc";

export const firstMoveCondition: MoveConditionFunc = (user, _target, _move) => user.summonData?.waveTurnCount === 1;
