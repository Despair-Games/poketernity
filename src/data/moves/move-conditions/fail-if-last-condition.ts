import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

export const failIfLastCondition: MoveConditionFunc = (_user: Pokemon, _target: Pokemon, _move: Move) =>
  !globalScene.currentBattle.turnManager.isEmpty();
