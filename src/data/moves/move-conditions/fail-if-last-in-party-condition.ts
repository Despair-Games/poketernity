import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export const failIfLastInPartyCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) => {
  const party: Pokemon[] = user.getParty();
  return party.some((pokemon) => pokemon.isActive() && !pokemon.isOnField());
};
