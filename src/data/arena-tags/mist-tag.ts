import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { InfiltratorAbAttr } from "#abilities/infiltrator-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTag } from "#arena-tags/arena-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Mist_(move) Mist}.
 * Prevents Pokémon on the opposing side from lowering the stats of the Pokémon in the Mist.
 */
export class MistTag extends ArenaTag {
  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.MIST, turnCount, MoveId.MIST, sourceId, side);
  }

  override onAdd(arena: Arena, quiet: boolean = false): void {
    super.onAdd(arena);

    if (this.sourceId) {
      const source = globalScene.getPokemonById(this.sourceId);

      if (!quiet && source) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("arenaTag:mistOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(source) }),
        );
      } else if (!quiet) {
        console.warn("Failed to get source for MistTag onAdd");
      }
    }
  }

  /**
   * Cancels the lowering of stats
   * @param _arena the {@linkcode Arena} containing this effect
   * @param simulated `true` if the effect should be applied quietly
   * @param attacker the {@linkcode Pokemon} using a move into this effect.
   * @param cancelled a {@linkcode BooleanHolder} whose value is set to `true`
   * to flag the stat reduction as cancelled
   * @returns `true` if a stat reduction was cancelled; `false` otherwise
   */
  override apply(_arena: Arena, simulated: boolean, attacker: Pokemon, cancelled: BooleanHolder): boolean {
    if (attacker?.isActive(true)) {
      const bypassed = new BooleanHolder(false);
      applyAbAttrs<InfiltratorAbAttr>(AbAttrFlag.INFILTRATOR, attacker, simulated, bypassed);
      if (bypassed.value) {
        return false;
      }
    }

    cancelled.value = true;

    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:mistApply"));
    }

    return true;
  }
}
