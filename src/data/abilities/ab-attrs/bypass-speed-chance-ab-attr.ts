import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * If a Pokémon with this Ability selects a damaging move, it has a 30% chance of going first in its priority bracket.
 * If the Ability activates, this is announced at the start of the turn (after move selection).
 */
export class BypassSpeedChanceAbAttr extends AbAttr {
  public readonly chance: number;

  /**
   * @param chance probability of ability being active.
   */
  constructor(chance: number) {
    super(true);
    this._flags.add(AbAttrFlag.BYPASS_SPEED_CHANCE);
    this.chance = chance;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, move: Move): boolean {
    if (move.category === MoveCategory.STATUS) {
      return false;
    }

    if (pokemon.randSeedInt(100) < this.chance) {
      if (!simulated) {
        return pokemon.addTag(BattlerTagType.BYPASS_SPEED);
      }
      return true;
    }

    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:quickDraw", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
}
