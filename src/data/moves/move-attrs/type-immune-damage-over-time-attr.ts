import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { AddArenaTagAttr } from "#moves/move-attrs/add-arena-tag-attr";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/G-Max_Wildfire_(move) | G-Max Wildfire}
 * and similar moves. Deals 1/6 max HP damage to foes that are not
 * of a specific {@link ElementalType | type} at the end of each turn for 4 turns.
 * @extends AddArenaTagAttr
 */
export class TypeImmuneDamageOverTimeAttr extends AddArenaTagAttr {
  /** Grants (+1) for each opponent that is not type-immune to the effect */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return (
      user.getOpponents().filter((opp) => !opp.isOfType(this.getImmuneType(), true, true)).length
      * MINOR_EFFECT_SCORE_BONUS
    );
  }

  private getImmuneType(): ElementalType {
    switch (this.tagType) {
      case ArenaTagType.G_MAX_WILDFIRE:
        return ElementalType.FIRE;
      case ArenaTagType.G_MAX_VINE_LASH:
        return ElementalType.GRASS;
      case ArenaTagType.G_MAX_CANNONADE:
        return ElementalType.WATER;
      case ArenaTagType.G_MAX_VOLCALITH:
        return ElementalType.ROCK;
      default:
        console.warn(`${this.constructor.name}: Unsupported tag type ${ArenaTagType[this.tagType]} detected!`);
        return ElementalType.UNKNOWN;
    }
  }
}
