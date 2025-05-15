import type { MoveConditionFunc } from "#app/@types/move-condition-func";

export const failOnMaxCondition: MoveConditionFunc = (_user, target, _move) => !target.isMax();
