import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Pokemon } from "#app/field/pokemon";
import { StatusEffect } from "#enums/status-effect";
import type { Move } from "#moves/move";

export const userSleptOrComatoseCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) =>
  user.hasStatusEffect(StatusEffect.SLEEP);
