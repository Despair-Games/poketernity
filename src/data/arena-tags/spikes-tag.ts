import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { HitResult } from "#enums/hit-result";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Spikes_(move) Spikes}.
 * Applies up to 3 layers of Spikes, dealing 1/8th, 1/6th, or 1/4th of the the Pokémon's HP
 * in damage for 1, 2, or 3 layers of Spikes respectively if they are summoned into this trap.
 */
export class SpikesTag extends EntryHazardTag {
  public override readonly tagType = ArenaTagType.SPIKES;

  public override get maxLayers(): 3 {
    return 3;
  }

  constructor(sourceId: number | undefined, side: ArenaTagSide) {
    super(MoveId.SPIKES, sourceId, side);
  }

  override onAdd(quiet: boolean = false): void {
    super.onAdd();

    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
    if (!quiet && source) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("arenaTag:spikesOnAdd", {
          moveName: this.getMoveName(),
          opponentDesc: source.getOpponentDescriptor(),
        }),
      );
    }
  }

  protected override activateTrap(pokemon: Pokemon, simulated: boolean): boolean {
    if (pokemon.isGrounded()) {
      const cancelled = new BooleanHolder(false);
      applyAbAttrs("BlockNonDirectDamageAbAttr", pokemon, simulated, cancelled);

      if (simulated) {
        return !cancelled.value;
      }

      if (!cancelled.value) {
        const damageHpRatio = 1 / (10 - 2 * this.layers);
        const damage = toDmgValue(pokemon.getMaxHp() * damageHpRatio);

        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("arenaTag:spikesActivateTrap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        );
        pokemon.damageAndUpdate(damage, { result: HitResult.OTHER });
        return true;
      }
    }

    return false;
  }
}
