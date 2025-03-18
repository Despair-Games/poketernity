import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { Stat, type BattleStat } from "#enums/stat";
import { PostSummonStatStageChangeAbAttr } from "./post-summon-stat-stage-change-ab-attr";

/**
 * Applies a stat change after a Pokémon is summoned,
 * conditioned on the presence of a specific arena tag.
 *
 * Used by Wind Rider.
 *
 * @param tagType the {@linkcode ArenaTagType} to check for
 * @param stats an array of {@linkcode BattleStat}s to change. Defaults to {@linkcode Stat.ATK}
 * @param stages how much to change the stat(s) by. Defaults to 1
 * @extends PostSummonStatStageChangeAbAttr
 */
export class PostSummonStatStageChangeOnArenaAbAttr extends PostSummonStatStageChangeAbAttr {
  /**
   * The type of arena tag that conditions the stat change.
   * @private
   */
  private readonly tagType: ArenaTagType;

  constructor(tagType: ArenaTagType, stats: BattleStat[] = [Stat.ATK], stages: number = 1) {
    super(stats, stages, true, false);
    this.tagType = tagType;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (globalScene.arena.getTagOnSide(this.tagType, pokemon.getArenaTagSide())) {
      return super.apply(pokemon, simulated);
    }
    return false;
  }
}
