import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag associated with the move Grudge.
 * If this tag is active when the bearer faints from an opponent's move, the tag reduces that move's PP to 0.
 * Otherwise, it lapses when the bearer makes another move.
 * @extends BattlerTag
 */
export class GrudgeTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.GRUDGE, [BattlerTagLapseType.CUSTOM, BattlerTagLapseType.PRE_MOVE], 1, MoveId.GRUDGE);
  }

  override onAdd(pokemon: Pokemon) {
    super.onAdd(pokemon);
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:grudgeOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  /**
   * Activates Grudge's special effect on the attacking Pokemon and lapses the tag.
   * @param pokemon
   * @param lapseType
   * @param sourcePokemon {@linkcode Pokemon} the source of the move that fainted the tag's bearer
   * @returns `false` if Grudge activates its effect or lapses
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType, sourcePokemon?: Pokemon): boolean {
    if (lapseType === BattlerTagLapseType.CUSTOM && sourcePokemon) {
      if (sourcePokemon.isActive() && pokemon.isOpponent(sourcePokemon)) {
        const lastMove = pokemon.turnData.attacksReceived[0];
        const lastMoveData = sourcePokemon.getMoveset().find((m) => m.moveId === lastMove.moveId);
        if (lastMoveData && lastMove.moveId !== MoveId.STRUGGLE) {
          lastMoveData.ppUsed = lastMoveData.getMovePp();
          globalScene.phaseManager.queueMessagePhase(
            i18next.t("battlerTags:grudgeLapse", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              moveName: lastMoveData.getName(),
            }),
          );
        }
      }
      return false;
    } else {
      return super.lapse(pokemon, lapseType);
    }
  }
}
