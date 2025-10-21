import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { CommanderAbAttr } from "#abilities/commander-ab-attr";
import type { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import type { PendingHealTag } from "#arena-tags/pending-heal-tag";
import { ENTRY_HAZARD_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import { SpeciesFormChangeActiveTrigger } from "#form-change-triggers/species-form-change-active-trigger";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { inSpeedOrder } from "#utils/speed-order-generator";

export class PostSummonPhase extends PokemonPhase {
  public override readonly phaseName = "PostSummonPhase";

  public override start(): void {
    const pokemon = this.getPokemon();

    if (pokemon.hasStatusEffect(StatusEffect.TOXIC)) {
      pokemon.resetToxicTurnCounter();
    }

    // Apply pending heal effects from Healing Wish and Lunar Dance
    globalScene.arena.applyTags<PendingHealTag>(ArenaTagType.PENDING_HEAL, ArenaTagSide.BOTH, false, pokemon);

    globalScene.arena.applyTags<EntryHazardTag>([...ENTRY_HAZARD_ARENA_TAG_TYPES], ArenaTagSide.BOTH, false, pokemon);

    // If this is mystery encounter and has post summon phase tag, apply post summon effects
    if (globalScene.currentBattle.isBattleMysteryEncounter()) {
      pokemon.lapseTag(BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON);
    }

    applyAbAttrs<PostSummonAbAttr>(AbAttrFlag.POST_SUMMON, pokemon, false);
    for (const p of inSpeedOrder()) {
      applyAbAttrs<CommanderAbAttr>(AbAttrFlag.COMMANDER, p, false);
    }

    // If the Pokemon takes a different form when active, change its form
    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger, true);
    // Update weather-based forms in case the summoned Pokemon's Cloud Nine activated.
    // Other weather-changing effects are already accounted for.
    // TODO: Make Cloud Nine's ability attribute do this
    globalScene.arena.triggerWeatherBasedFormChanges();

    this.end();
  }
}
