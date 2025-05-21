import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

export class PreDefendFullHpEndureAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.PRE_DEFEND_FULL_HP_ENDURE);
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
