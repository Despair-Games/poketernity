import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { MoveTarget } from "#enums/move-target";
import type { Move } from "../move";
import type { MoveConditionFunc } from "../move-conditions";
import { ChanceBasedMoveEffectAttr, type ChanceBasedMoveEffectAttrOptions } from "./chance-based-move-effect-attr";

interface AddArenaTagAttrOptions extends ChanceBasedMoveEffectAttrOptions {
  /** The number of turns the tag is in effect */
  turnCount?: number;
  /** Should the move fail if an arena tag of the same type is already on the field? */
  failOnOverlap?: boolean;
}

/**
 * Attribute to add an arena tag to the field of a given {@linkcode ArenaTagType | type}.
 * @extends ChanceBasedMoveEffectAttr
 */
export class AddArenaTagAttr extends ChanceBasedMoveEffectAttr {
  protected readonly tagType: ArenaTagType;
  protected readonly relativeSide: ArenaTagRelativeSide;
  protected override options?: AddArenaTagAttrOptions;

  constructor(
    tagType: ArenaTagType,
    relativeSide: ArenaTagRelativeSide = ArenaTagRelativeSide.TARGET,
    options?: AddArenaTagAttrOptions,
  ) {
    super(true);

    this.tagType = tagType;
    this.relativeSide = relativeSide;
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

  protected getTagSide(user: Pokemon, move: Move): ArenaTagSide {
    switch (move.moveTarget) {
      case MoveTarget.USER_SIDE:
        return user.getArenaTagSide();
      case MoveTarget.ENEMY_SIDE:
        return user.getOpposingArenaTagSide();
      case MoveTarget.BOTH_SIDES:
        return ArenaTagSide.BOTH;
    }

    switch (this.relativeSide) {
      case ArenaTagRelativeSide.USER:
        return user.getArenaTagSide();
      case ArenaTagRelativeSide.TARGET:
        return user.getOpposingArenaTagSide();
      case ArenaTagRelativeSide.ALL:
        return ArenaTagSide.BOTH;
    }
  }

  override applyEffect(user: Pokemon, _target: null, move: Move): boolean {
    const side = this.getTagSide(user, move);
    return globalScene.arena.addTag(this.tagType, user.id, this.turnCount, move.id, side);
  }

  override getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap
      ? (user, _target, move) => !globalScene.arena.getTagOnSide(this.tagType, this.getTagSide(user, move))
      : null;
  }
}
