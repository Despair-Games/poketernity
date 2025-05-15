import type { MoveConditionFunc } from "#types/MoveConditionFunc";

export const failOnBossCondition: MoveConditionFunc = (_user, target, _move) => !target.isBossImmune();
