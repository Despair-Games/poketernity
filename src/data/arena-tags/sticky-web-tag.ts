import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Sticky_Web_(move) Sticky Web}.
 * Applies up to 1 layer of Sticky Web, which lowers the Speed by one stage
 * to any Pokémon who is summoned into this trap.
 */
export class StickyWebTag extends EntryHazardTag {
  public override readonly tagType = ArenaTagType.STICKY_WEB;

  public override get maxLayers(): 1 {
    return 1;
  }

  constructor(sourceId: number | undefined, side: ArenaTagSide) {
    super(MoveId.STICKY_WEB, sourceId, side);
  }

  // TODO Should `quiet` ever be `true`?
  public override onAdd(quiet: boolean = false): void {
    super.onAdd();
    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
    if (!quiet && source) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(`arenaTag:stickyWebOnAdd${this.i18nSideKey}Side`, {
          moveName: this.getMoveName(),
          opponentDesc: source.getOpponentDescriptor(),
        }),
      );
    }
  }

  public override activateTrap(pokemon: Pokemon, simulated: boolean): boolean {
    if (!pokemon.isGrounded()) {
      return false;
    }

    const cancelled = new ValueHolder(false);
    applyAbAttrs("ProtectStatAbAttr", { pokemon, simulated, stat: Stat.SPD, cancelled });

    if (simulated) {
      return !cancelled.value;
    }
    if (cancelled.value) {
      return false;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("arenaTag:stickyWebActivateTrap", { pokemonName: pokemon.getNameToRender() }),
    );
    const stages = new ValueHolder(-1);
    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      pokemon.getBattlerIndex(),
      this.getSourcePokemon(),
      [Stat.SPD],
      stages.value,
      { isStickyWeb: true },
    );
    return true;
  }
}
