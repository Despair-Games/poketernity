import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { ElementalType } from "#enums/elemental-type";

export const failIfGhostTypeCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  !target.isOfType(ElementalType.GHOST);
