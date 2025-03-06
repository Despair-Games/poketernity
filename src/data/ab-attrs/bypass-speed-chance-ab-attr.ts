import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { AbAttr } from "./ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "../move";
import { MoveCategory } from "#enums/move-category";

/**
 * If a Pokémon with this Ability selects a damaging move, it has a 30% chance of going first in its priority bracket.
 * If the Ability activates, this is announced at the start of the turn (after move selection).
 * @extends AbAttr
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

  override apply(pokemon: Pokemon, simulated: boolean, move: Move): boolean {
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

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:quickDraw", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
}
