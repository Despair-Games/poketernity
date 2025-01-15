import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

export class PreDefendFullHpEndureAbAttr extends PreDefendAbAttr {
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
