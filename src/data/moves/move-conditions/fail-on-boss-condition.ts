import type { MoveConditionFunc } from "#types/move-condition-func";

export const failOnBossCondition: MoveConditionFunc = (_user, target, _move) => !target.isBossImmune();
