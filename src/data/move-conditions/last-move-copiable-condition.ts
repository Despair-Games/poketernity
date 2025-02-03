import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { allMoves } from "#app/data/all-moves";
import { globalScene } from "#app/global-scene";

export const lastMoveCopiableCondition: MoveConditionFunc = (_user, _target, _move) => {
  const copiableMove = globalScene.currentBattle.lastMoveId;

  if (!copiableMove) {
    return false;
  }

  if (allMoves[copiableMove].isChargingMove()) {
    return false;
  }

  // TODO: Add last turn of Bide
  return true;
};
