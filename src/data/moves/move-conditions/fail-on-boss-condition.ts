import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";

export const failOnBossCondition: MoveConditionFunc = (_user, target, _move) => !target.isBossImmune();
