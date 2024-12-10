import { BattlerTagType } from "#app/enums/battler-tag-type";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type Move from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

export class PreDefendFullHpEndureAbAttr extends PreDefendAbAttr {
  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (
      pokemon.isFullHp()
      && pokemon.getMaxHp() > 1 //Checks if pokemon has wonder_guard (which forces 1hp)
      && (args[0] as NumberHolder).value >= pokemon.hp
    ) {
      //Damage >= hp
      return simulated || pokemon.addTag(BattlerTagType.STURDY, 1);
    }

    return false;
  }
}
