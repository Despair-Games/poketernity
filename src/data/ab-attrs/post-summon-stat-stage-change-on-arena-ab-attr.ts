import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { Stat } from "#enums/stat";
import { PostSummonStatStageChangeAbAttr } from "./post-summon-stat-stage-change-ab-attr";

/**
 * Applies a stat change after a Pokémon is summoned,
 * conditioned on the presence of a specific arena tag.
 *
 * @extends PostSummonStatStageChangeAbAttr
 */
export class PostSummonStatStageChangeOnArenaAbAttr extends PostSummonStatStageChangeAbAttr {
  /**
   * The type of arena tag that conditions the stat change.
   * @private
   */
  private tagType: ArenaTagType;

  /**
   * Creates an instance of PostSummonStatStageChangeOnArenaAbAttr.
   * Initializes the stat change to increase Attack by 1 stage if the specified arena tag is present.
   *
   * @param tagType the {@linkcode ArenaTagType} to check for.
   */
  constructor(tagType: ArenaTagType) {
    super([Stat.ATK], 1, true, false);
    this.tagType = tagType;
  }

  /**
   * Applies the post-summon stat change if the specified arena tag is present on pokemon's side.
   * This is used in Wind Rider ability.
   *
   * @param pokemon The {@linkcode Pokemon} being summoned
   * @param passive Whether the effect is passive
   * @param args Additional arguments
   * @returns Returns `true` if the stat change was applied, otherwise `false`
   */
  override applyPostSummon(pokemon: Pokemon, passive: boolean, simulated: boolean, args: any[]): boolean {
    if (globalScene.arena.getTagOnSide(this.tagType, pokemon.getArenaTagSide())) {
      return super.applyPostSummon(pokemon, passive, simulated, args);
    }
    return false;
  }
}
