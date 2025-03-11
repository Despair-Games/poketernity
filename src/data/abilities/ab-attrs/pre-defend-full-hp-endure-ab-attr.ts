import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

export class PreDefendFullHpEndureAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.PRE_DEFEND_FULL_HP_ENDURE);
  }

  override apply(pokemon: Pokemon, simulated: boolean, _attacker: Pokemon, _move: Move, damage: NumberHolder): boolean {
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
