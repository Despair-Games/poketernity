/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { handleMysteryEncounterBattleStartEffects } from "#mystery-encounters/encounter-phase-utils";
import type { MysteryEncounter } from "#mystery-encounters/mystery-encounter";
import type { TurnEndPhase } from "#phases/turn-end-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SwitchType } from "#enums/switch-type";

/**
 * Runs at the beginning of an Encounter's battle.
 *
 * Will clean up any residual flinches, Endure, etc. that are left over from {@linkcode MysteryEncounter.startOfBattleEffects}
 *
 * Will also handle Game Overs, switches, etc. that could happen from {@linkcode handleMysteryEncounterBattleStartEffects}
 *
 * @see {@linkcode TurnEndPhase} for more details
 */
export class MysteryEncounterBattleStartCleanupPhase extends Phase {
  public override readonly phaseName = "MysteryEncounterBattleStartCleanupPhase";

  /**
   * Cleans up `TURN_END` tags, any {@linkcode PostTurnStatusEffectPhase}s, checks for Pokemon switches, then continues
   */
  public override start(): void {
    super.start();

    // Lapse any residual flinches/endures but ignore all other turn-end battle tags
    const includedLapseTags: readonly BattlerTagType[] = [BattlerTagType.FLINCHED, BattlerTagType.ENDURING];
    const field = globalScene.getField(true);
    field.forEach((pokemon) => {
      const tags = pokemon.summonData.tags;
      tags
        .filter(
          (t) =>
            includedLapseTags.includes(t.tagType)
            && t.lapseTypes.includes(BattlerTagLapseType.TURN_END)
            && !t.lapse(pokemon, BattlerTagLapseType.TURN_END),
        )
        .forEach((t) => {
          t.onRemove(pokemon);
          tags.splice(tags.indexOf(t), 1);
        });
    });

    // Remove any status tick phases
    while (globalScene.phaseManager.findPhase((p) => p.is("PostTurnStatusEffectPhase"))) {
      globalScene.phaseManager.tryRemovePhase((p) => p.is("PostTurnStatusEffectPhase"));
    }

    /** The total number of Pokemon in the player's party that can legally fight */
    const legalPlayerPokemon = globalScene.getPokemonAllowedInBattle();
    /** The total number of legal player Pokemon that aren't currently on the field */
    const legalPlayerPartyPokemon = legalPlayerPokemon.filter((p) => !p.isActive(true));
    if (!legalPlayerPokemon.length) {
      globalScene.phaseManager.queueGameOverPhase({ clearPhaseQueue: false });
      this.end();
      return;
    }

    // Check for any KOd player mons and switch
    // For each fainted mon on the field, if there is a legal replacement, summon it
    const playerField = globalScene.getPlayerField();
    playerField.forEach((pokemon, i) => {
      if (!pokemon.isAllowedInBattle() && legalPlayerPartyPokemon.length > i) {
        globalScene.phaseManager.createAndUnshiftPhase("SwitchPhase", i, SwitchType.SWITCH);
      }
    });

    // THEN, if is a double battle, and player only has 1 summoned pokemon, center pokemon on field
    if (globalScene.currentBattle.double && legalPlayerPokemon.length === 1 && legalPlayerPartyPokemon.length === 0) {
      globalScene.phaseManager.createAndUnshiftPhase("ToggleDoublePositionPhase", true);
    }

    this.end();
  }
}
