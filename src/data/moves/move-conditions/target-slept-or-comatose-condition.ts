import type { Pokemon } from "#app/field/pokemon";
import { StatusEffect } from "#enums/status-effect";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

export const targetSleptOrComatoseCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  target.hasStatusEffect(StatusEffect.SLEEP);
