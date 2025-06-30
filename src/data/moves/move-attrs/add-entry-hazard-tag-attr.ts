import { globalScene } from "#app/global-scene";
import type { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddArenaTagAttr } from "#moves/add-arena-tag-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Attribute to add a {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes | hazard} to the field.
 */
export class AddEntryHazardTagAttr extends AddArenaTagAttr {
  override getCondition(): MoveConditionFunc {
    return (user, _target, move) => {
      const side = this.getTagSide(user, move);
      const tag = globalScene.arena.findTag<EntryHazardTag>(this.tagType, side);
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    };
  }

  /** Grants (+1), with an additional (+1) on the first turn of a wave */
  public override getEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const firstTurnBonus = globalScene.currentBattle.turn <= 1 ? MINOR_EFFECT_SCORE_BONUS : 0;
    return MINOR_EFFECT_SCORE_BONUS + firstTurnBonus;
  }
}
