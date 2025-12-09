import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

/**
 * If the pokemon with this `AbAttr` is full HP and is hit with a move that would 1-hit faint it,
 * it will survive with 1 HP left (_unless it also has the ability Wonder Guard_).
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Sturdy_(Ability) | Sturdy Ability - Bulbapedia}
 */
export class SturdyAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "SturdyAbAttr";

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _damage: ValueHolder<number>,
  ): void {
    if (!simulated) {
      pokemon.addTag(BattlerTagType.STURDY, 1);
    }
  }

  public override canApply(...[pokemon, , , , damage]: Parameters<this["apply"]>): boolean {
    return pokemon.isFullHp() && pokemon.getMaxHp() > 1 && damage.value >= pokemon.hp;
  }
}
