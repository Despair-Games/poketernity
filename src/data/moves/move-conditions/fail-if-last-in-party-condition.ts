import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#moves/move";

export const failIfLastInPartyCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) => {
  const party: Pokemon[] = user.getParty();
  return party.some((pokemon) => pokemon.isActive() && !pokemon.isOnField());
};
