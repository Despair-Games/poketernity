import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Lucky_Chant_(move) Lucky Chant}.
 * Prevents critical hits against the tag's side.
 */
export class NoCritTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.NO_CRIT;

  /** Queues a message upon adding this effect to the field */
  override onAdd(): void {
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(`arenaTag:noCritOnAdd${this.i18nSideKey}`, {
        moveName: this.getMoveName(),
      }),
    );
  }

  /** Queues a message upon removing this effect from the field */
  override onRemove(): void {
    const source = globalScene.getPokemonById(this.sourceId!); // TODO: is this bang correct?
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("arenaTag:noCritOnRemove", {
        pokemonNameWithAffix: getPokemonNameWithAffix(source ?? undefined),
        moveName: this.getMoveName(),
      }),
    );
  }
}
