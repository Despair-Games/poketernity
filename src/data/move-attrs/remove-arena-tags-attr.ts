import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Generic class for removing arena tags
 * @param tagTypes: The types of tags that can be removed
 * @param selfSideTarget: Is the user removing tags from its own side?
 */
export class RemoveArenaTagsAttr extends MoveEffectAttr {
  public tagTypes: ArenaTagType[];
  public selfSideTarget: boolean;

  constructor(tagTypes: ArenaTagType[], selfSideTarget: boolean) {
    super(true);

    this.tagTypes = tagTypes;
    this.selfSideTarget = selfSideTarget;
  }

  /** Removes arena tags of types matching {@linkcode tagTypes} from the user or target's side */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const side = (this.selfSideTarget ? user : target).getArenaTagSide();

    for (const tagType of this.tagTypes) {
      globalScene.arena.removeTagOnSide(tagType, side);
    }

    return true;
  }
}
