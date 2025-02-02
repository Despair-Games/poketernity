import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { ElementType } from "#enums/element-type";

export const unknownTypeCondition: MoveConditionFunc = (user, _target, _move) =>
  !user.getTypes().includes(ElementType.UNKNOWN);
