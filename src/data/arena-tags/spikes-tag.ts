import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { HitResult } from "#enums/hit-result";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Spikes_(move) Spikes}.
 * Applies up to 3 layers of Spikes, dealing 1/8th, 1/6th, or 1/4th of the the Pokémon's HP
 * in damage for 1, 2, or 3 layers of Spikes respectively if they are summoned into this trap.
 */
export class SpikesTag extends EntryHazardTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.SPIKES, MoveId.SPIKES, sourceId, side, 3);
  }

  override onAdd(arena: Arena, quiet: boolean = false): void {
    super.onAdd(arena);

    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
    if (!quiet && source) {
      globalScene.phaseManager.queueMessagePhase(
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
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, simulated, cancelled);

      if (simulated) {
        return !cancelled.value;
      }

      if (!cancelled.value) {
        const damageHpRatio = 1 / (10 - 2 * this.layers);
        const damage = toDmgValue(pokemon.getMaxHp() * damageHpRatio);

        globalScene.phaseManager.queueMessagePhase(
          i18next.t("arenaTag:spikesActivateTrap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        );
        pokemon.damageAndUpdate(damage, { result: HitResult.OTHER });
        return true;
      }
    }

    return false;
  }
}
