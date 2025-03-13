import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { ElementalType } from "#enums/elemental-type";

export const unknownTypeCondition: MoveConditionFunc = (user, _target, _move) =>
  !user.getTypes().includes(ElementalType.UNKNOWN);
