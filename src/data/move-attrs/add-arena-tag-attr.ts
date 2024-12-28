import { type Pokemon, MoveResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { Move } from "../move";
import type { MoveConditionFunc } from "../move-conditions";
import { MoveEffectAttr } from "./move-effect-attr";

export class AddArenaTagAttr extends MoveEffectAttr {
  public tagType: ArenaTagType;
  public turnCount: number;
  private failOnOverlap: boolean;
  public selfSideTarget: boolean;

  constructor(
    tagType: ArenaTagType,
    turnCount?: number | null,
    failOnOverlap: boolean = false,
    selfSideTarget: boolean = false,
  ) {
    super(true);

    this.tagType = tagType;
    this.turnCount = turnCount!; // TODO: is the bang correct?
    this.failOnOverlap = failOnOverlap;
    this.selfSideTarget = selfSideTarget;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (
      (move.chance < 0 || move.chance === 100 || user.randSeedInt(100) < move.chance)
      && user.getLastXMoves(1)[0]?.result === MoveResult.SUCCESS
    ) {
      const side = (this.selfSideTarget ? user : target).getArenaTagSide();
      globalScene.arena.addTag(this.tagType, this.turnCount, move.id, user.id, side);
      return true;
    }

    return false;
  }

  override getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap
      ? (_user, target, _move) => !globalScene.arena.getTagOnSide(this.tagType, target.getArenaTagSide())
      : null;
  }
}
