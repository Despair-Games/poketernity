import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { randSeedInt, type NumberHolder, toDmgValue } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class PresentPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    /**
     * If this move is multi-hit, and this attribute is applied to any hit
     * other than the first, this move cannot result in a heal.
     */
    const firstHit = user.turnData.hitCount === user.turnData.hitsLeft;

    const powerSeed = randSeedInt(firstHit ? 100 : 80);
    if (powerSeed <= 40) {
      (args[0] as NumberHolder).value = 40;
    } else if (40 < powerSeed && powerSeed <= 70) {
      (args[0] as NumberHolder).value = 80;
    } else if (70 < powerSeed && powerSeed <= 80) {
      (args[0] as NumberHolder).value = 120;
    } else if (80 < powerSeed && powerSeed <= 100) {
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
