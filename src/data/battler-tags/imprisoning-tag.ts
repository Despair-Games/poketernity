import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { RestrictingBattlerTag } from "#app/data/battler-tags/restricting-battler-tag";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the move-disabling effect of
 * {@link https://bulbapedia.bulbagarden.net/wiki/Imprison_(move) | Imprison}.
 * Disables all opposing Pokemon's moves that are also found in the tag owner's moveset.
 * @extends BattlerTag
 * @implements `RestrictingBattlerTag`
 */
export class ImprisoningTag extends BattlerTag implements RestrictingBattlerTag {
  constructor() {
    super(BattlerTagType.IMPRISONING, BattlerTagLapseType.CUSTOM, 1);
  }

  override onAdd(pokemon: Pokemon): void {
    globalScene.queueMessage(
      i18next.t("battlerTags:imprisonOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  /**
   * Prevents opposing Pokemon from using moves that match with
   * the tag owner's moveset.
   * @param pokemon The {@linkcode Pokemon} with this tag
   * @param simulated If `true`, suppresses the message triggered by an interruption
   * @param actingPokemon The {@linkcode Pokemon} attempting to select or use a move
   * @param moveId The {@linkcode MoveId} for the move being selected or used
   * @returns `true` if the given move is disabled by this tag
   */
  override apply(pokemon: Pokemon, simulated: boolean, actingPokemon: Pokemon, moveId: MoveId): boolean {
    if (pokemon.getMoveset().some((mv) => mv.moveId === moveId)) {
      if (!simulated) {
        globalScene.queueMessage(this.getInterruptedText(actingPokemon, moveId));
      }
      return true;
    }
    return false;
  }

  public getInterruptedText(pokemon: Pokemon, moveId: MoveId): string {
    return i18next.t("battle:moveDisabledImprison", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: allMoves.get(moveId).name,
    });
  }

  public getSelectionDeniedText(pokemon: Pokemon, moveId: MoveId): string {
    return this.getInterruptedText(pokemon, moveId);
  }
}
