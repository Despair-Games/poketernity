import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { globalScene } from "#app/global-scene";

export const failIfSingleBattle: MoveConditionFunc = (_user, _target, _move) => globalScene.currentBattle.double;
