import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { globalScene } from "#app/global-scene";

export const failIfSingleBattle: MoveConditionFunc = (_user, _target, _move) => globalScene.currentBattle.double;
