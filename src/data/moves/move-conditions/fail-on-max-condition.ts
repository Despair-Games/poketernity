import type { MoveConditionFunc } from "#types/MoveConditionFunc";

export const failOnMaxCondition: MoveConditionFunc = (_user, target, _move) => !target.isMax();
