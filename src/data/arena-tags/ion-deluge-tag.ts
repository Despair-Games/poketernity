import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { NumberHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Ion_Deluge_(move) | Ion Deluge}
 * and the secondary effect of {@link https://bulbapedia.bulbagarden.net/wiki/Plasma_Fists_(move) | Plasma Fists}.
 * Converts Normal-type moves to Electric type for the rest of the turn.
 * @extends ArenaTag
 */
export class IonDelugeTag extends ArenaTag {
  constructor(sourceMoveId?: MoveId) {
    super(ArenaTagType.ION_DELUGE, 1, sourceMoveId);
  }

  /** Queues an on-add message */
  override onAdd(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:plasmaFistsOnAdd"));
  }

  override onRemove(_arena: Arena): void {} // Removes default on-remove message

  /**
   * Converts Normal-type moves to Electric type
   * @param _arena n/a
   * @param _simulated n/a
   * @param moveType a {@linkcode NumberHolder} containing a move's {@linkcode ElementalType}
   * @returns `true` if the given move type changed; `false` otherwise.
   */
  override apply(_arena: Arena, _simulated: boolean, moveType: NumberHolder): boolean {
    if (moveType.value === ElementalType.NORMAL) {
      moveType.value = ElementalType.ELECTRIC;
      return true;
    }
    return false;
  }
}
