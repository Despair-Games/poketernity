import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export const userSleptOrComatoseCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) =>
  user.hasStatusEffect(StatusEffect.SLEEP);
