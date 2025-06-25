import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";
import type { Arena } from "#field/arena";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Toxic_Spikes_(move) Toxic Spikes}.
 * Applies up to 2 layers of Toxic Spikes, poisoning or badly poisoning any Pokémon who is
 * summoned into this trap if 1 or 2 layers of Toxic Spikes respectively are up. Poison-type
 * Pokémon summoned into this trap remove it entirely.
 */
export class ToxicSpikesTag extends EntryHazardTag {
  private neutralized: boolean;

  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.TOXIC_SPIKES, MoveId.TOXIC_SPIKES, sourceId, side, 2);
    this.neutralized = false;
  }

  override onAdd(arena: Arena, quiet: boolean = false): void {
    super.onAdd(arena);

    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
    if (!quiet && source) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("arenaTag:toxicSpikesOnAdd", {
          moveName: this.getMoveName(),
          opponentDesc: source.getOpponentDescriptor(),
        }),
      );
    }
  }

  override onRemove(arena: Arena): void {
    if (!this.neutralized) {
      super.onRemove(arena);
    }
  }

  override activateTrap(pokemon: Pokemon, simulated: boolean): boolean {
    if (pokemon.isGrounded()) {
      if (simulated) {
        return true;
      }
      if (pokemon.isOfType(ElementalType.POISON)) {
        this.neutralized = true;
        if (globalScene.arena.removeTag(this.tagType)) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
            i18next.t("arenaTag:toxicSpikesActivateTrapPoison", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              moveName: this.getMoveName(),
            }),
          );
          return true;
        }
      } else if (!pokemon.hasNonVolatileStatusEffect()) {
        const inflictsToxic = this.layers > 1;
        return pokemon.trySetStatus(
          inflictsToxic ? StatusEffect.TOXIC : StatusEffect.POISON,
          true,
          null,
          0,
          this.getMoveName(),
        );
      }
    }

    return false;
  }

  override getMatchupScoreMultiplier(pokemon: Pokemon): number {
    if (pokemon.isGrounded() || !pokemon.canSetStatus(StatusEffect.POISON, true)) {
      return 1;
    }
    if (pokemon.isOfType(ElementalType.POISON)) {
      return 1.25;
    }
    return super.getMatchupScoreMultiplier(pokemon);
  }
}
