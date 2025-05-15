import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { globalScene } from "#app/global-scene";
import { ArenaTagType } from "#enums/arena-tag-type";

export const failOnGravityCondition: MoveConditionFunc = (_user, _target, _move) =>
  !globalScene.arena.hasTag(ArenaTagType.GRAVITY);
