import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/PokemonDefendCondition";

export class PostDefendApplyEntryHazardTagAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly tagType: ArenaTagType;

  constructor(condition: PokemonDefendCondition, tagType: ArenaTagType) {
    super(true);

    this.condition = condition;
    this.tagType = tagType;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (!this.condition(pokemon, attacker, move)) {
      return false;
    }

    const tag = globalScene.arena.findTag<EntryHazardTag>(this.tagType);
    if (!tag || tag.layers < tag.maxLayers) {
      if (!simulated) {
        globalScene.arena.addTag(this.tagType, pokemon.id, undefined, undefined, pokemon.getOpposingArenaTagSide());
      }
      return true;
    }

    return false;
  }
}
