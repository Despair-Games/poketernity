import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";

export const userSleptOrComatoseCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) =>
  user.status?.effect === StatusEffect.SLEEP || user.hasAbility(Abilities.COMATOSE);
