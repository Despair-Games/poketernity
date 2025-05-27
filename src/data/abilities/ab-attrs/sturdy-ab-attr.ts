import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

/**
 * If the pokemon with this ab-attr is full hp and hit with a move that would 1-hit faint it, it will survive with 1 hp left.
 * Wonder Guard _overrules_ this ab-attr.
 *
 * #### Boss Pokemon
 * To consider a boss Pokemon as 1-hit faint, the damage calculation is different and depends on the hp segments.
 * Every segment past the first one gets a `x SegmentIndex` multiplier.
 * E.g. if the boss has 3 segments and each with 10 hp, the damage for the 1-hit faint must be at least `60`,
 * because `10 * 1 + 10 * 2 + 10 * 3 = 60`.
 *
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Sturdy_(Ability) | Sturdy Ability - Bulbapedia}
 */
export class SturdyAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.STURDY);
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    damage: NumberHolder,
  ): boolean {
    if (
      pokemon.isFullHp()
      && pokemon.getMaxHp() > 1 // Checks if pokemon has Wonder Guard (which forces 1hp)
      && damage.value >= pokemon.hp
    ) {
      return simulated || pokemon.addTag(BattlerTagType.STURDY, 1);
    }

    return false;
  }
}
