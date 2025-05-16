import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaRoomTag } from "#arena-tags/arena-room-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Trick_Room_(move) Trick Room}.
 * Reverses the Speed calculation for all Pokémon on the field as long as this arena tag is up.
 * @extends ArenaRoomTag
 */
export class TrickRoomTag extends ArenaRoomTag {
  constructor(turnCount: number, sourceId: number) {
    super(ArenaTagType.TRICK_ROOM, turnCount, MoveId.TRICK_ROOM, sourceId);
  }

  /**
   * @param speedReversed - A {@linkcode BooleanHolder} used to flag if Speed-based
   * turn order should be reversed.
   * @returns `true`
   */
  override apply(_arena: Arena, _simulated: boolean, speedReversed: BooleanHolder): boolean {
    speedReversed.value = !speedReversed.value;
    return true;
  }

  override onAdd(_arena: Arena): void {
    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
    if (source) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("arenaTag:trickRoomOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(source) }),
      );
    }
  }

  override onRemove(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:trickRoomOnRemove"));
  }
}
