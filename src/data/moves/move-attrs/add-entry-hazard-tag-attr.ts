import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { MINOR_EFFECT_SCORE_BONUS } from "#app/constants/ai-constants";
import type { EntryHazardTag } from "#app/data/arena-tag";
import type { Move } from "#app/data/moves/move";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { AddArenaTagAttr } from "./add-arena-tag-attr";

/**
 * Attribute to add a {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes | hazard} to the field.
 * @extends AddArenaTagAttr
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
