import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { ArenaTagSide } from "../arena-tag";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Attribute to remove {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes hazards}
 * from the field.
 * @extends MoveEffectAttr
 */
export class RemoveArenaTrapAttr extends MoveEffectAttr {
  private targetBothSides: boolean;

  constructor(targetBothSides: boolean = false) {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
    this.targetBothSides = targetBothSides;
  }

  /**
   * Removes hazards from either the user's (?) side of the field
   * or both sides of the field, depending on {@linkcode targetBothSides}
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    if (this.targetBothSides) {
      globalScene.arena.removeTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.TOXIC_SPIKES, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.STEALTH_ROCK, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.STICKY_WEB, ArenaTagSide.PLAYER);

      globalScene.arena.removeTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.TOXIC_SPIKES, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.STEALTH_ROCK, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.STICKY_WEB, ArenaTagSide.ENEMY);
    } else {
      const opposingSide = target.getOpposingArenaTagSide();
      globalScene.arena.removeTagOnSide(ArenaTagType.SPIKES, opposingSide);
      globalScene.arena.removeTagOnSide(ArenaTagType.TOXIC_SPIKES, opposingSide);
      globalScene.arena.removeTagOnSide(ArenaTagType.STEALTH_ROCK, opposingSide);
      globalScene.arena.removeTagOnSide(ArenaTagType.STICKY_WEB, opposingSide);
    }

    return true;
  }
}
