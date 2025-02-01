import { type Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { HitHealAttr } from "../move-attrs/hit-heal-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Class for abilities that make drain moves deal damage to user instead of healing them.
 * @extends PostDefendAbAttr
 * @see {@linkcode applyPostDefend}
 */
export class ReverseDrainAbAttr extends PostDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.REVERSE_DRAIN);
  }

  /**
   * Determines if a damage and draining move was used to check if this ability should stop the healing.
   * Examples include: Absorb, Draining Kiss, Bitter Blade, etc.
   * Also displays a message to show this ability was activated.
   * @param pokemon {@linkcode Pokemon} with this ability
   * @param simulated N/A
   * @param attacker {@linkcode Pokemon} that is attacking this Pokemon
   * @param move {@linkcode Move} that is being used
   * @param args N/A
   * @returns true if healing should be reversed on a healing move, false otherwise.
   */
  override apply(_pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (move.hasAttr(HitHealAttr)) {
      if (!simulated) {
        globalScene.queueMessage(
          i18next.t("abilityTriggers:reverseDrain", { pokemonNameWithAffix: getPokemonNameWithAffix(attacker) }),
        );
      }
      return true;
    }
    return false;
  }
}
