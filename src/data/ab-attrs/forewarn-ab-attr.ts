import { OneHitKOAttr } from "../move-attrs/one-hit-ko-attr";
import { StatusMove } from "../move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { Moves } from "#enums/moves";
import i18next from "i18next";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

export class ForewarnAbAttr extends PostSummonAbAttr {
  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    let maxPowerSeen = 0;
    let maxMove = "";
    let movePower = 0;
    for (const opponent of pokemon.getOpponents()) {
      for (const move of opponent.moveset) {
        if (move.getMove() instanceof StatusMove) {
          movePower = 1;
        } else if (move.getMove().hasAttr(OneHitKOAttr)) {
          movePower = 150;
        } else if (
          move.getMove().id === Moves.COUNTER
          || move.getMove().id === Moves.MIRROR_COAT
          || move.getMove().id === Moves.METAL_BURST
        ) {
          movePower = 120;
        } else if (move.getMove().power === -1) {
          movePower = 80;
        } else {
          movePower = move.getMove().power;
        }

        if (movePower > maxPowerSeen) {
          maxPowerSeen = movePower;
          maxMove = move.getName();
        }
      }
    }
    if (!simulated) {
      globalScene.queueMessage(
        i18next.t("abilityTriggers:forewarn", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          moveName: maxMove,
        }),
      );
    }
    return true;
  }
}
