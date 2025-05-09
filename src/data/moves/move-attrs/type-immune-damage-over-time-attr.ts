import { MINOR_EFFECT_SCORE_BONUS } from "#app/constants/ai-constants";
import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";

export class TypeImmuneDamageOverTimeAttr extends AddArenaTagAttr {
  constructor(tagType: ArenaTagType) {
    super(tagType);
  }

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
