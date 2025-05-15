import { ElementalType } from "#enums/elemental-type";
import type { MoveConditionFunc } from "#types/move-condition-func";

export const unknownTypeCondition: MoveConditionFunc = (user, _target, _move) =>
  !user.getTypes().includes(ElementalType.UNKNOWN);
