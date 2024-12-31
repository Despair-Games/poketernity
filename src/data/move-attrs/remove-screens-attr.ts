import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { ArenaTagSide } from "../arena-tag";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

export class RemoveScreensAttr extends MoveEffectAttr {
  private targetBothSides: boolean;

  constructor(targetBothSides: boolean = false) {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
    this.targetBothSides = targetBothSides;
  }

  /** Removes the effects of Reflect, Light Screen, and Aurora Veil */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    if (this.targetBothSides) {
      globalScene.arena.removeTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.AURORA_VEIL, ArenaTagSide.PLAYER);

      globalScene.arena.removeTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.AURORA_VEIL, ArenaTagSide.ENEMY);
    } else {
      const side = target.getArenaTagSide();
      globalScene.arena.removeTagOnSide(ArenaTagType.REFLECT, side);
      globalScene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, side);
      globalScene.arena.removeTagOnSide(ArenaTagType.AURORA_VEIL, side);
    }

    return true;
  }
}
