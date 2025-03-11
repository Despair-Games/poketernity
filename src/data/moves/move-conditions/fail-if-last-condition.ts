import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";

export const failIfLastCondition: MoveConditionFunc = (_user: Pokemon, _target: Pokemon, _move: Move) =>
  !globalScene.currentBattle.turnManager.isEmpty();
