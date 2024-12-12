import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import { type ArenaTrapTag, ArenaTagSide } from "#app/data/arena-tag";
import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendApplyArenaTrapTagAbAttr extends PostDefendAbAttr {
  private condition: PokemonDefendCondition;
  private tagType: ArenaTagType;

  constructor(condition: PokemonDefendCondition, tagType: ArenaTagType) {
    super(true);

    this.condition = condition;
    this.tagType = tagType;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (this.condition(pokemon, attacker, move)) {
      const tag = globalScene.arena.getTag(this.tagType) as ArenaTrapTag;
      if (!globalScene.arena.getTag(this.tagType) || tag.layers < tag.maxLayers) {
        if (!simulated) {
          globalScene.arena.addTag(
            this.tagType,
            0,
            undefined,
            pokemon.id,
            pokemon.isPlayer() ? ArenaTagSide.ENEMY : ArenaTagSide.PLAYER,
          );
        }
        return true;
      }
    }
    return false;
  }
}
