import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import { OneHitKOAttr } from "#moves/one-hit-ko-attr";
import i18next from "i18next";

export class ForewarnAbAttr extends PostSummonAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    let maxPowerSeen = 0;
    let moveName = "";
    let movePower = 0;
    const movesets: PokemonMove[] = [];

    for (const opponent of pokemon.getOpponents()) {
      // TODO: should this consider summon data movesets (such as from Transform)?
      movesets.push(...opponent.getMoveset(true));
    }

    for (const move of movesets) {
      if (move.getMove().isStatusMove()) {
        movePower = 1;
      } else if (move.getMove().hasAttr(OneHitKOAttr)) {
        movePower = 150;
      } else if (
        move.getMove().id === MoveId.COUNTER
        || move.getMove().id === MoveId.MIRROR_COAT
        || move.getMove().id === MoveId.METAL_BURST
      ) {
        movePower = 120;
      } else if (move.getMove().power === -1) {
        movePower = 80;
      } else {
        movePower = move.getMove().power;
      }

      // TODO: if multiple moves have the same effective power, one should be randomly chosen from them
      if (movePower > maxPowerSeen) {
        maxPowerSeen = movePower;
        moveName = move.getName();
      }
    }

    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("abilityTriggers:forewarn", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          moveName,
        }),
      );
    }

    return true;
  }
}
