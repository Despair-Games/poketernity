import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { type NumberHolder, toDmgValue } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to set move power based on one of four random outcomes (listed below).
 * - 40% : 40 BP attack
 * - 30% : 80 BP attack
 * - 10% : 120 BP attack
 * - 20% : Heal 25% of the target's HP
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Present_(move) | Present}.
 * @extends VariablePowerAttr
 */
export class PresentPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, power: NumberHolder): boolean {
    /**
     * If this move is multi-hit, and this attribute is applied to any hit
     * other than the first, this move cannot result in a heal.
     */
    const isFirstHit = user.turnData.hitCount === user.turnData.hitsLeft && user.turnData.hitsLeft > 0;

    const powerSeed = user.randSeedInt(isFirstHit ? 100 : 80);
    if (powerSeed < 40) {
      power.value = 40;
    } else if (powerSeed < 70) {
      power.value = 80;
    } else if (powerSeed < 80) {
      power.value = 120;
    } else if (powerSeed < 100) {
      // If this move is multi-hit, disable all other hits
      user.turnData.hitCount = 1;
      user.turnData.hitsLeft = 1;
      globalScene.unshiftPhase(
        new PokemonHealPhase(target.getBattlerIndex(), toDmgValue(target.getMaxHp() / 4), {
          message: i18next.t("moveTriggers:regainedHealth", { pokemonName: getPokemonNameWithAffix(target) }),
        }),
      );
    }

    return true;
  }
}
