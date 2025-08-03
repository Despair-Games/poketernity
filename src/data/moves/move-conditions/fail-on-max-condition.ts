import type { MoveConditionFunc } from "#types/move-types";

export const failOnMaxCondition: MoveConditionFunc = (_user, target, _move) => !target.isMax();
