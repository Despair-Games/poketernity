import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Tera_Shell_(Ability) | Tera Shell}. \
 * When the source is at full HP, incoming attacks will have a maximum `0.5x` type effectiveness multiplier.
 */
export class FullHpResistTypeAbAttr extends PreDefendAbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.FULL_HP_RESIST_TYPE);
  }

  /**
   * Reduces a type multiplier to 0.5 if the source is at full HP.
   * @param pokemon {@linkcode Pokemon} the Pokemon with this ability
   * @param simulated n/a (this doesn't change game state)
   * @param attacker n/a
   * @param move {@linkcode Move} the move being used on the source
   * @param typeMultiplier a container for the move's current type effectiveness multiplier
   */
  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    typeMultiplier: ValueHolder<number>,
  ): void {
    typeMultiplier.value = 0.5;
    if (!simulated) {
      pokemon.turnData.moveEffectiveness = 0.5;
    }
  }

  public override canApply(...[pokemon, , , move, typeMultiplier]: Parameters<this["apply"]>): boolean {
    return pokemon.isFullHp() && typeMultiplier.value > 0.5 && !move.hasAttr(FixedDamageAttr);
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:fullHpResistType", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
    });
  }
}
