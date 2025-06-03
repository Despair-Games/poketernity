import { getGameMode } from "#app/game-mode";
import overrides from "#app/overrides";
import { BattleStyle } from "#enums/battle-style";
import { GameModes } from "#enums/game-modes";
import { Nature } from "#enums/nature";
import type { SpeciesId } from "#enums/species-id";
import { UiMode } from "#enums/ui-mode";
import { CommandPhase } from "#phases/command-phase";
import { EncounterPhase } from "#phases/encounter-phase";
import { SelectStarterPhase } from "#phases/select-starter-phase";
import { TurnInitPhase } from "#phases/turn-init-phase";
import { settings } from "#system/settings-manager";
import { generateStarter } from "#test/test-utils/game-manager-utils";
import { GameManagerHelper } from "#test/test-utils/helpers/game-manager-helper";
import { vi } from "vitest";

/**
 * Helper to handle classic mode specifics
 */
export class ClassicModeHelper extends GameManagerHelper {
  /**
   * Runs the classic game to the summon phase.
   * @param species - The species to start the battle with. At least one must be specified, up to 6 max.
   * @returns A promise that resolves when the summon phase is reached.
   */
  async runToSummon(species: SpeciesId, ...extraSpecies: SpeciesId[]): Promise<void> {
    if (overrides.STARTER_SPECIES_OVERRIDE) {
      throw new Error(
        "The player species override should not be used for classic mode tests. Pass the species you want to use to the `runToSummon` or `startBattle` function.",
      );
    }
    const starterSpecies = [species, ...extraSpecies];
    await this.game.runToTitle();

    if (this.game.override.disableShinies) {
      this.game.override.shiny(false).enemyShiny(false);
    }
    if (this.game.override.normalizeIVs) {
      this.game.override.playerIVs(31).enemyIVs(31);
    }
    if (this.game.override.normalizeNatures) {
      this.game.override.nature(Nature.HARDY).enemyNature(Nature.HARDY);
    }

    this.game.onNextPrompt("TitlePhase", UiMode.TITLE, () => {
      this.game.scene.gameMode = getGameMode(GameModes.CLASSIC);
      const starters = generateStarter(this.game.scene, starterSpecies);
      const selectStarterPhase = new SelectStarterPhase();
      this.game.scene.phaseManager.pushPhase(new EncounterPhase(false));
      selectStarterPhase.initBattle(starters);
    });

    await this.game.phaseInterceptor.to("EncounterPhase");
    if (overrides.ENEMY_HELD_ITEMS_OVERRIDE.length === 0 && this.game.override.removeEnemyStartingItems) {
      this.game.removeEnemyHeldItems();
    }
  }

  /**
   * Transitions to the start of a battle.
   * @param species - The species to start the battle with. At least one must be specified, up to 6 max.
   * @returns A promise that resolves when the battle is started.
   */
  async startBattle(species: SpeciesId, ...extraSpecies: SpeciesId[]): Promise<void> {
    await this.runToSummon(species, ...extraSpecies);

    if (settings.general.battleStyle === BattleStyle.SWITCH) {
      this.game.onNextPrompt(
        "CheckSwitchPhase",
        UiMode.CONFIRM,
        () => {
          this.game.setMode(UiMode.MESSAGE);
          this.game.endPhase();
        },
        () => this.game.isCurrentPhase(CommandPhase) || this.game.isCurrentPhase(TurnInitPhase),
      );

      this.game.onNextPrompt(
        "CheckSwitchPhase",
        UiMode.CONFIRM,
        () => {
          this.game.setMode(UiMode.MESSAGE);
          this.game.endPhase();
        },
        () => this.game.isCurrentPhase(CommandPhase) || this.game.isCurrentPhase(TurnInitPhase),
      );
    }

    if (this.game.override.disableExpGain) {
      vi.spyOn(overrides, "LEVEL_CAP_OVERRIDE", "get").mockReturnValue(1);
    }

    await this.game.phaseInterceptor.to("CommandPhase");
    console.log("==================[New Turn]==================");
  }
}
