import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import { type EntryHazardTag } from "#app/data/arena-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendApplyEntryHazardTagAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly tagType: ArenaTagType;

  constructor(condition: PokemonDefendCondition, tagType: ArenaTagType) {
    super(true);

    this.condition = condition;
    this.tagType = tagType;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (this.condition(pokemon, attacker, move)) {
      const tag = globalScene.arena.getTag(this.tagType) as EntryHazardTag;
      if (!globalScene.arena.getTag(this.tagType) || tag.layers < tag.maxLayers) {
        if (!simulated) {
          globalScene.arena.addTag(this.tagType, pokemon.id, undefined, undefined, pokemon.getOpposingArenaTagSide());
        }
        return true;
      }
    }
    return false;
  }
}
