import type { MoveConditionFunc } from "#app/@types/move-condition-func";

export const failOnBossCondition: MoveConditionFunc = (_user, target, _move) => !target.isBossImmune();
