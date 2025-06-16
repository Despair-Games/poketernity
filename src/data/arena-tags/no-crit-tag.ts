import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Lucky_Chant_(move) Lucky Chant}.
 * Prevents critical hits against the tag's side.
 */
export class NoCritTag extends ArenaTag {
  /**
   * Constructor method for the NoCritTag class
   * @param turnCount `number` the number of turns this effect lasts
   * @param sourceMoveId {@linkcode MoveId} the move that created this effect
   * @param sourceId `number` the ID of the {@linkcode Pokemon} that created this effect
   * @param side {@linkcode ArenaTagSide} the side to which this effect belongs
   */
  constructor(turnCount: number, sourceMoveId: MoveId, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.NO_CRIT, turnCount, sourceMoveId, sourceId, side);
  }

  /** Queues a message upon adding this effect to the field */
  override onAdd(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(
      i18next.t(`arenaTag:noCritOnAdd${this.i18nSideKey}`, {
        moveName: this.getMoveName(),
      }),
    );
  }

  /** Queues a message upon removing this effect from the field */
  override onRemove(_arena: Arena): void {
    const source = globalScene.getPokemonById(this.sourceId!); // TODO: is this bang correct?
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("arenaTag:noCritOnRemove", {
        pokemonNameWithAffix: getPokemonNameWithAffix(source ?? undefined),
        moveName: this.getMoveName(),
      }),
    );
  }
}
