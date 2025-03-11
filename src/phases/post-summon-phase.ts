import type { BattlerIndex } from "#enums/battler-index";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { EntryHazardArenaTagTypes } from "#app/utils/arena-tag-type-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PhaseId } from "#enums/phase-id";

export class PostSummonPhase extends PokemonPhase {
  override readonly id = PhaseId.POST_SUMMON;

  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  public override start(): void {
    super.start();

    const pokemon = this.getPokemon();

    if (pokemon.hasStatusEffect(StatusEffect.TOXIC)) {
      pokemon.status!.toxicTurnCount = 0;
    }
    globalScene.arena.applyTags([...EntryHazardArenaTagTypes], false, pokemon);

    // If this is mystery encounter and has post summon phase tag, apply post summon effects
    if (
      globalScene.currentBattle.isBattleMysteryEncounter()
      && pokemon.findTags((t) => t.isMysteryEncounterPostSummonTag()).length > 0
    ) {
      pokemon.lapseTag(BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON);
    }

    applyAbAttrs(AbAttrFlag.POST_SUMMON, pokemon, false);
    const field = pokemon.getField();
    field.forEach((p) => applyAbAttrs(AbAttrFlag.COMMANDER, p, false));

    this.end();
  }
}
