import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { SturdyAbAttrParams } from "#types/ab-attr-param-types";

/**
 * If the pokemon with this `AbAttr` is full HP and is hit with a move that would 1-hit faint it,
 * it will survive with 1 HP left (_unless it also has the ability Wonder Guard_).
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Sturdy_(Ability) | Sturdy Ability - Bulbapedia}
 */
export class SturdyAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "SturdyAbAttr";

  public override apply({ pokemon, simulated }: SturdyAbAttrParams): void {
    if (!simulated) {
      pokemon.addTag(BattlerTagType.STURDY, 1);
    }
  }

  public override canApply({ pokemon, damage }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.isFullHp() && pokemon.getMaxHp() > 1 && damage.value >= pokemon.hp;
  }
}
