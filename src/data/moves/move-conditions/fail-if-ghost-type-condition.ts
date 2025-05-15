import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export const failIfGhostTypeCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  !target.isOfType(ElementalType.GHOST);
