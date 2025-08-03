import type { MoveConditionFunc } from "#types/move-types";

export const failOnBossCondition: MoveConditionFunc = (_user, target, _move) => !target.isBossImmune();
