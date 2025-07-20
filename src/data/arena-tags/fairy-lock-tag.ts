import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Fairy_Lock_(move) Fairy Lock}.
 * Fairy Lock prevents all Pokémon (except Ghost types) on the field from switching out or
 * fleeing during their next turn.
 * If a Pokémon that's on the field when Fairy Lock is used goes on to faint later in the same turn,
 * the Pokémon that replaces it will still be unable to switch out in the following turn.
 */
export class FairyLockTag extends ArenaTag {
  constructor(turnCount: number, sourceId: number) {
    super(ArenaTagType.FAIRY_LOCK, turnCount, MoveId.FAIRY_LOCK, sourceId);
  }

  override onAdd(): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:fairyLockOnAdd"));
  }
}
