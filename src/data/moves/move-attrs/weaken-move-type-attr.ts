import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import type { Move } from "#moves/move";
import { AddArenaTagAttr } from "#moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Mud_Sport | "Sport" moves}.
 * Halves the power of ALL moves of a specific type for 5 turns.
 * @extends AddArenaTagAttr
 */
export class WeakenMoveTypeAttr extends AddArenaTagAttr {
  constructor(tagType: ArenaTagType) {
    super(tagType, ArenaTagRelativeSide.ALL, { turnCount: 5, failOnOverlap: true });
  }

  /**
   * Grants an effect score modifier as follows:
   * 1. Count the number of active Pokemon on each side that are of the effect's
   * weakened type (ignoring Tera)
   * 2. If more opponents would be weakened than allies, grant a 50%(+1) bonus.
   * 3. Otherwise, grant a (-5) penalty.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const weakenedType = this.getWeakenedType();
    const numWeakenedOpponents = user.getOpponents().filter((p) => p.isOfType(weakenedType, false)).length;
    const numWeakenedAllies = user.getField().filter((p) => p.isActive(true) && p.isOfType(weakenedType, false)).length;

    return numWeakenedOpponents > numWeakenedAllies ? this.getRandomScore(user, 50) : BAD_MOVE_PENALTY;
  }

  /**
   * Determines the type of moves that are weakened by the effects of this
   * attribute's {@linkcode ArenaTagType}.
   * @returns the weakened {@linkcode ElementalType}
   * @todo Link this to data in the associated arena tags
   */
  private getWeakenedType(): ElementalType {
    switch (this.tagType) {
      case ArenaTagType.WATER_SPORT:
        return ElementalType.FIRE;
      case ArenaTagType.MUD_SPORT:
        return ElementalType.ELECTRIC;
      default:
        console.warn(`${this.constructor.name}: Unsupported tag type ${ArenaTagType[this.tagType]} detected!`);
        return ElementalType.UNKNOWN;
    }
  }
}
