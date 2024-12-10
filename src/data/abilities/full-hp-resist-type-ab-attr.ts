import type Pokemon from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { type BooleanHolder, NumberHolder } from "#app/utils";
import i18next from "i18next";
import { type Move, FixedDamageAttr } from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Tera_Shell_(Ability) | Tera Shell}
 * When the source is at full HP, incoming attacks will have a maximum 0.5x type effectiveness multiplier.
 * @extends PreDefendAbAttr
 */
export class FullHpResistTypeAbAttr extends PreDefendAbAttr {
  /**
   * Reduces a type multiplier to 0.5 if the source is at full HP.
   * @param pokemon {@linkcode Pokemon} the Pokemon with this ability
   * @param _passive n/a
   * @param _simulated n/a (this doesn't change game state)
   * @param _attacker n/a
   * @param move {@linkcode Move} the move being used on the source
   * @param _cancelled n/a
   * @param args `[0]` a container for the move's current type effectiveness multiplier
   * @returns `true` if the move's effectiveness is reduced; `false` otherwise
   */
  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker: Pokemon,
    move: Move | null,
    _cancelled: BooleanHolder | null,
    args: any[],
  ): boolean {
    const typeMultiplier = args[0];
    if (!(typeMultiplier && typeMultiplier instanceof NumberHolder)) {
      return false;
    }

    if (move && move.hasAttr(FixedDamageAttr)) {
      return false;
    }

    if (pokemon.isFullHp() && typeMultiplier.value > 0.5) {
      typeMultiplier.value = 0.5;
      pokemon.turnData.moveEffectiveness = 0.5;
      return true;
    }
    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:fullHpResistType", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
    });
  }
}
