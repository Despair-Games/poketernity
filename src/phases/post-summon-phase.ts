import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#app/battle";
import { applyAbAttrs, applyPostSummonAbAttrs } from "#app/data/ability";
import { CommanderAbAttr } from "#app/data/ab-attrs/commander-ab-attr";
import { ArenaTrapTag } from "#app/data/arena-tag";
import { StatusEffect } from "#app/enums/status-effect";
import { PokemonPhase } from "./pokemon-phase";
import { MysteryEncounterPostSummonTag } from "#app/data/battler-tags";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PostSummonAbAttr } from "#app/data/ab-attrs/post-summon-ab-attr";

export class PostSummonPhase extends PokemonPhase {
  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  override start() {
    super.start();

    const pokemon = this.getPokemon();

    if (pokemon.status?.effect === StatusEffect.TOXIC) {
      pokemon.status.toxicTurnCount = 0;
    }
    globalScene.arena.applyTags(ArenaTrapTag, false, pokemon);

    // If this is mystery encounter and has post summon phase tag, apply post summon effects
    if (
      globalScene.currentBattle.isBattleMysteryEncounter()
      && pokemon.findTags((t) => t instanceof MysteryEncounterPostSummonTag).length > 0
    ) {
      pokemon.lapseTag(BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON);
    }

    applyPostSummonAbAttrs(PostSummonAbAttr, pokemon);
    const field = pokemon.getField();
    field.forEach((p) => applyAbAttrs(CommanderAbAttr, p, null, false));

    this.end();
  }
}
