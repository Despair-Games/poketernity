import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";

export const failOnMaxCondition: MoveConditionFunc = (_user, target, _move) => !target.isMax();
