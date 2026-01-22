import { PostSummonStatStageChangeAbAttr } from "#abilities/post-summon-stat-stage-change-ab-attr";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { type BattleStat, Stat } from "#enums/stat";

/**
 * Applies a stat change after a Pokémon is summoned,
 * conditioned on the presence of a specific arena tag.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Wind_Rider_(Ability) | Wind Rider (Bulbapedia)}
 * @param tagType - The {@linkcode ArenaTagType} to check for
 * @param stats - (Default `[Stat.ATK]`) An array of {@linkcode BattleStat}s to change
 * @param stages - (Default `1`) How much to change the stat(s) by
 */
export class PostSummonStatStageChangeOnArenaAbAttr extends PostSummonStatStageChangeAbAttr {
  /** The type of arena tag that conditions the stat change. */
  private readonly tagType: ArenaTagType;

  constructor(tagType: ArenaTagType, stats: BattleStat[] = [Stat.ATK], stages: number = 1) {
    super(stats, stages, true, false);
    this.tagType = tagType;
  }

  public override canApply(params: Parameters<this["apply"]>[0]): boolean {
    const { pokemon } = params;
    return globalScene.arena.hasTag(this.tagType, pokemon.getArenaTagSide()) && super.canApply(params);
  }
}
