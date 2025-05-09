import type { Pokemon } from "#app/field/pokemon";
import { ElementalType } from "#enums/elemental-type";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

export const failIfGhostTypeCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  !target.isOfType(ElementalType.GHOST);
