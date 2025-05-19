import { globalScene } from "#app/global-scene";
import type { MoveConditionFunc } from "#types/move-condition-func";

export const failIfSingleBattle: MoveConditionFunc = (_user, _target, _move) => globalScene.currentBattle.double;
