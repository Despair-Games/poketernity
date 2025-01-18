import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { Move } from "../move";
import type { MoveConditionFunc } from "../move-conditions";
import { ChanceBasedMoveEffectAttr, type ChanceBasedMoveEffectAttrOptions } from "./chance-based-move-effect-attr";

interface AddArenaTagAttrOptions extends ChanceBasedMoveEffectAttrOptions {
  /** The number of turns the tag is in effect */
  turnCount?: number;
  /** Should the move fail if an arena tag of the same type is already on the field? */
  failOnOverlap?: boolean;
  /** Should the effect be placed on the user's side of the field instead of the target's side? */
  selfSideTarget?: boolean;
}

/**
 * Attribute to add an arena tag to the field of a given {@linkcode ArenaTagType | type}.
 * @extends ChanceBasedMoveEffectAttr
 */
export class AddArenaTagAttr extends ChanceBasedMoveEffectAttr {
  public tagType: ArenaTagType;
  protected override options?: AddArenaTagAttrOptions;

  constructor(tagType: ArenaTagType, options?: AddArenaTagAttrOptions) {
    super(true);

    this.tagType = tagType;
    this.options = options;
  }

  /**
   * The number of turns the added tag remains in effect.
   * @default 0, which denotes an arena tag that lasts indefinitely until the next arena reset.
   */
  public get turnCount() {
    return this.options?.turnCount ?? 0;
  }

  /**
   * If `true`, causes the move to fail when a tag already exists
   * where it would otherwise be added on the field.
   * @default false
   */
  public get failOnOverlap() {
    return this.options?.failOnOverlap ?? false;
  }

  /**
   * If `true`, places the arena tag on the user's side of the field
   * instead of the target's side.
   * @default false
   */
  public get selfSideTarget() {
    return this.options?.selfSideTarget ?? false;
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    const side = (this.selfSideTarget ? user : target).getArenaTagSide();
    return globalScene.arena.addTag(this.tagType, user.id, this.turnCount, move.id, side);
  }

  override getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap
      ? (_user, target, _move) => !globalScene.arena.getTagOnSide(this.tagType, target.getArenaTagSide())
      : null;
  }
}
