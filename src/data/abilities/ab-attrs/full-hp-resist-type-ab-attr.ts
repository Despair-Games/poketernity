import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Tera_Shell_(Ability) | Tera Shell}
 * When the source is at full HP, incoming attacks will have a maximum 0.5x type effectiveness multiplier.
 * @extends PreDefendAbAttr
 */
export class FullHpResistTypeAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.FULL_HP_RESIST_TYPE);
  }

  /**
   * Reduces a type multiplier to 0.5 if the source is at full HP.
   * @param pokemon {@linkcode Pokemon} the Pokemon with this ability
   * @param simulated n/a (this doesn't change game state)
   * @param attacker n/a
   * @param move {@linkcode Move} the move being used on the source
   * @param typeMultiplier a container for the move's current type effectiveness multiplier
   * @returns `true` if the move's effectiveness is reduced; `false` otherwise
   */
  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    _attacker: Pokemon,
    move: Move,
    typeMultiplier: NumberHolder,
  ): boolean {
    if (move?.hasAttr(FixedDamageAttr)) {
      return false;
    }

    if (pokemon.isFullHp() && typeMultiplier.value > 0.5) {
      typeMultiplier.value = 0.5;
      if (!simulated) {
        pokemon.turnData.moveEffectiveness = 0.5;
      }
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
