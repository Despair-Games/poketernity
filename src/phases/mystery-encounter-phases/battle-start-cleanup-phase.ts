import { BattlerTagLapseType } from "#app/data/battler-tags";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { GameOverPhase } from "#app/phases/game-over-phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { ToggleDoublePositionPhase } from "#app/phases/toggle-double-position-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SwitchType } from "#enums/switch-type";

/**
 * Runs at the beginning of an Encounter's battle
 * Will clean up any residual flinches, Endure, etc. that are left over from {@linkcode MysteryEncounter.startOfBattleEffects}
 * Will also handle Game Overs, switches, etc. that could happen from {@linkcode handleMysteryEncounterBattleStartEffects}
 * See {@linkcode TurnEndPhase} for more details
 */

export class MysteryEncounterBattleStartCleanupPhase extends Phase {
  /**
   * Cleans up `TURN_END` tags, any {@linkcode PostTurnStatusEffectPhase}s, checks for Pokemon switches, then continues
   */
  public override start(): void {
    super.start();

    // Lapse any residual flinches/endures but ignore all other turn-end battle tags
    const includedLapseTags = [BattlerTagType.FLINCHED, BattlerTagType.ENDURING];
    const field = globalScene.getField(true).filter((p) => p.summonData);
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
    while (globalScene.findPhase((p) => p instanceof PostTurnStatusEffectPhase)) {
      globalScene.tryRemovePhase((p) => p instanceof PostTurnStatusEffectPhase);
    }

    /** The total number of Pokemon in the player's party that can legally fight */
    const legalPlayerPokemon = globalScene.getPokemonAllowedInBattle();
    /** The total number of legal player Pokemon that aren't currently on the field */
    const legalPlayerPartyPokemon = legalPlayerPokemon.filter((p) => !p.isActive(true));
    if (!legalPlayerPokemon.length) {
      globalScene.unshiftPhase(new GameOverPhase());
      return this.end();
    }

    // Check for any KOd player mons and switch
    // For each fainted mon on the field, if there is a legal replacement, summon it
    const playerField = globalScene.getPlayerField();
    playerField.forEach((pokemon, i) => {
      if (!pokemon.isAllowedInBattle() && legalPlayerPartyPokemon.length > i) {
        globalScene.unshiftPhase(new SwitchPhase(SwitchType.SWITCH, i, true, false));
      }
    });

    // THEN, if is a double battle, and player only has 1 summoned pokemon, center pokemon on field
    if (globalScene.currentBattle.double && legalPlayerPokemon.length === 1 && legalPlayerPartyPokemon.length === 0) {
      globalScene.unshiftPhase(new ToggleDoublePositionPhase(true));
    }

    this.end();
  }
}
