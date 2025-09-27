import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import type { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/move-types";

export class PostDefendApplyEntryHazardTagAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;
  private readonly tagType: ArenaTagType;

  constructor(condition: PokemonDefendCondition, tagType: ArenaTagType) {
    super();

    this.condition = condition;
    this.tagType = tagType;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, _attacker: Pokemon, _move: Move): void {
    if (!simulated) {
      globalScene.arena.addTag(this.tagType, pokemon.id, undefined, undefined, pokemon.getOpposingArenaTagSide());
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    if (!this.condition(pokemon, attacker, move)) {
      return false;
    }
    const existingTag = globalScene.arena.findTag<EntryHazardTag>(this.tagType);
    return existingTag == null || existingTag.layers < existingTag.maxLayers;
  }
}
