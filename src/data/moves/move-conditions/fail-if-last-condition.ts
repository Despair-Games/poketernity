import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export const failIfLastCondition: MoveConditionFunc = (_user: Pokemon, _target: Pokemon, _move: Move) =>
  !globalScene.currentBattle.turnManager.isEmpty();
