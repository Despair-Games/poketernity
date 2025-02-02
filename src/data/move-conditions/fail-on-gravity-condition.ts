import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { globalScene } from "#app/global-scene";
import { ArenaTagType } from "#enums/arena-tag-type";

export const failOnGravityCondition: MoveConditionFunc = (_user, _target, _move) =>
  !globalScene.arena.getTag(ArenaTagType.GRAVITY);
