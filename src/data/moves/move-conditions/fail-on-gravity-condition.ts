import { globalScene } from "#app/global-scene";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveConditionFunc } from "#types/move-condition-func";

export const failOnGravityCondition: MoveConditionFunc = (_user, _target, _move) =>
  !globalScene.arena.hasTag(ArenaTagType.GRAVITY);
