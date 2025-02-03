import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { globalScene } from "#app/global-scene";

export const lastMoveCopiableCondition: MoveConditionFunc = (_user, _target, _move) => {
  const copiableMove = globalScene.currentBattle.lastMove;

  if (!copiableMove) {
    return false;
  }

  if (copiableMove.isChargingMove()) {
    return false;
  }

  // TODO: Add last turn of Bide
  return true;
};
