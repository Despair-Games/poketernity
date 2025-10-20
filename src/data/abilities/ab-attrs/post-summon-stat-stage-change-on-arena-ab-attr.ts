import { PostSummonStatStageChangeAbAttr } from "#abilities/post-summon-stat-stage-change-ab-attr";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { type BattleStat, Stat } from "#enums/stat";

/**
 * Applies a stat change after a Pokémon is summoned,
 * conditioned on the presence of a specific arena tag.
 *
 * Used by Wind Rider.
 *
 * @param tagType the {@linkcode ArenaTagType} to check for
 * @param stats an array of {@linkcode BattleStat}s to change. Defaults to {@linkcode Stat.ATK}
 * @param stages how much to change the stat(s) by. Defaults to 1
 */
export class PostSummonStatStageChangeOnArenaAbAttr extends PostSummonStatStageChangeAbAttr {
  /** The type of arena tag that conditions the stat change. */
  private readonly tagType: ArenaTagType;

  constructor(tagType: ArenaTagType, stats: BattleStat[] = [Stat.ATK], stages: number = 1) {
    super(stats, stages, true, false);
    this.tagType = tagType;
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [pokemon] = params;
    return globalScene.arena.hasTag(this.tagType, pokemon.getArenaTagSide()) && super.canApply(...params);
  }
}
