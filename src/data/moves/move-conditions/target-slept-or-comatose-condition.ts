import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export const targetSleptOrComatoseCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  target.hasStatusEffect(StatusEffect.SLEEP);
