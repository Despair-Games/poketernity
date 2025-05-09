import { ENTRY_HAZARD_ARENA_TAG_TYPES } from "#app/constants/arena-tag-constants";
import type { CommanderAbAttr } from "#app/data/abilities/ab-attrs/commander-ab-attr";
import type { PostSummonAbAttr } from "#app/data/abilities/ab-attrs/post-summon-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { MysteryEncounterPostSummonTag } from "#app/data/battler-tags/mystery-encounter-post-summon-tag";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "#app/phases/abstract-pokemon-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PhaseId } from "#enums/phase-id";
import { StatusEffect } from "#enums/status-effect";

export class PostSummonPhase extends PokemonPhase {
  override readonly id = PhaseId.POST_SUMMON;

  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

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
