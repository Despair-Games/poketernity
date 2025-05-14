import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { CommanderAbAttr } from "#abilities/commander-ab-attr";
import type { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { MysteryEncounterPostSummonTag } from "#battler-tags/mystery-encounter-post-summon-tag";
import { ENTRY_HAZARD_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PhaseId } from "#enums/phase-id";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";

export class PostSummonPhase extends PokemonPhase {
  override readonly id = PhaseId.POST_SUMMON;

  public override start(): void {
    super.start();

    const pokemon = this.getPokemon();

    if (pokemon.hasStatusEffect(StatusEffect.TOXIC)) {
      pokemon.resetToxicTurnCounter();
    }

    // Apply pending heal effects from Healing Wish and Lunar Dance.
    globalScene.arena.applyTags(ArenaTagType.PENDING_HEAL, false, pokemon);

    globalScene.arena.applyTags([...ENTRY_HAZARD_ARENA_TAG_TYPES], false, pokemon);

    // If this is mystery encounter and has post summon phase tag, apply post summon effects
    if (
      globalScene.currentBattle.isBattleMysteryEncounter()
      && pokemon.findTags((t) => t.isType<MysteryEncounterPostSummonTag>(BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON))
        .length > 0
    ) {
      pokemon.lapseTag(BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON);
    }

    applyAbAttrs<PostSummonAbAttr>(AbAttrFlag.POST_SUMMON, pokemon, false);
    const field = pokemon.getField();
    field.forEach((p) => applyAbAttrs<CommanderAbAttr>(AbAttrFlag.COMMANDER, p, false));

    this.end();
  }
}
