import type { MoveConditionFunc } from "#types/move-condition-func";

export const failOnMaxCondition: MoveConditionFunc = (_user, target, _move) => !target.isMax();
