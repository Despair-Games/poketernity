import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";

export const targetSleptOrComatoseCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  target.status?.effect === StatusEffect.SLEEP || target.hasAbility(Abilities.COMATOSE);
