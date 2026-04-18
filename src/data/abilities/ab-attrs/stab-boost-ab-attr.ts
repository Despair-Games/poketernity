import { AbAttr } from "#abilities/ab-attr";
import { ElementalType } from "#enums/elemental-type";
import type { StabBoostAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Increases the STAB multiplier by `+0.5` if the move type is the same as one of the pokemon's types. \
 * If the Pokemon is terastallized, then the STAB multiplier is only applied if the move type is the same as the tera type. \
 * The total STAB multiplier is capped at `2.25`.
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Adaptability_(Ability)}
 * @see {@link https://github.com/Despair-Games/poketernity/blob/beta/docs/stab.md}
 */
export class StabBoostAbAttr extends AbAttr {
  protected override readonly abAttrKey = "StabBoostAbAttr";

  public override apply({ pokemon, move, stabMultiplier }: StabBoostAbAttrParams): void {
    if (pokemon.isTerastallized) {
      if (pokemon.getTypes().includes(pokemon.teraType) && pokemon.teraType === pokemon.getMoveType(move)) {
        // If the tera type is one of the pokemon's original types then the STAB multiplier is increased by 0.25 (to 2.25)
        stabMultiplier.value += 0.25;
      } else if (pokemon.teraType === pokemon.getMoveType(move)) {
        // if the tera type is NOT one of the pokemon's original types but is the same as the move type then the STAB multiplier is increased by 0.5
        stabMultiplier.value += 0.5;
      }
    } else if (pokemon.getTypes().includes(pokemon.getMoveType(move))) {
      // If the move type is one of the pokemon's original types then the STAB multiplier is increased by 0.5
      stabMultiplier.value += 0.5;
    }
  }

  public override canApply({ pokemon, move }: Parameters<this["apply"]>[0]): boolean {
    const moveType = pokemon.getMoveType(move);
    return moveType !== ElementalType.STELLAR && pokemon.getTypes(true).includes(moveType);
  }
}
