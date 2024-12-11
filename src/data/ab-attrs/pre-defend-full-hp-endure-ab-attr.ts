import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
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
    const damage: NumberHolder = args[0];
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
