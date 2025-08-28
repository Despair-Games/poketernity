import { activeOverrides } from "#app/overrides";
import type { Challenge } from "#data/challenge";
import { BattleStyle } from "#enums/battle-style";
import type { Challenges } from "#enums/challenges";
import type { SpeciesId } from "#enums/species-id";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import { generateStarter } from "#test/test-utils/game-manager-utils";
import { GameManagerHelper } from "#test/test-utils/helpers/game-manager-helper";
import { copyChallenge } from "data/challenge";
import { vi } from "vitest";

/**
 * Helper to handle Challenge mode specifics
 */
export class ChallengeModeHelper extends GameManagerHelper {
  challenges: Challenge[] = [];

  /**
   * Adds a challenge to the challenge mode helper.
   * @param id - The challenge id.
   * @param value - The challenge value.
   * @param severity - The challenge severity.
   */
  addChallenge(id: Challenges, value: number, severity: number) {
    const challenge = copyChallenge({ id, value, severity });
    this.challenges.push(challenge);
  }

  /**
   * Runs the Challenge game to the summon phase.
   * @param species - The species to start the battle with. At least one must be specified, up to 6 max.
   * @returns A promise that resolves when the summon phase is reached.
   */
  async runToSummon(species: SpeciesId, ...extraSpecies: SpeciesId[]): Promise<void> {
    if (activeOverrides.STARTER_SPECIES_OVERRIDE) {
      throw new Error(
        "The player species override should not be used for challenge mode tests. Pass the species you want to use to the `runToSummon` or `startBattle` function.",
      );
    }
    const starterSpecies = [species, ...extraSpecies];
    await this.game.runToTitle();

    if (this.game.override.disableShinies) {
      this.game.override.shiny(false).enemyShiny(false);
    }

    this.game.onNextPrompt("TitlePhase", UiMode.TITLE, () => {
      const { phaseManager } = this.game.scene;
      this.game.scene.gameMode.challenges = this.challenges;
      const starters = generateStarter(this.game.scene, starterSpecies);
      const selectStarterPhase = phaseManager.createPhase("SelectStarterPhase");
      phaseManager.createAndPushPhase("EncounterPhase", false);
      selectStarterPhase.initBattle(starters);
    });

    await this.game.phaseInterceptor.to("EncounterPhase");
    if (activeOverrides.ENEMY_HELD_ITEMS_OVERRIDE.length === 0 && this.game.override.removeEnemyStartingItems) {
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
        () => this.game.isCurrentPhase("CommandPhase") || this.game.isCurrentPhase("TurnInitPhase"),
      );

      this.game.onNextPrompt(
        "CheckSwitchPhase",
        UiMode.CONFIRM,
        () => {
          this.game.setMode(UiMode.MESSAGE);
          this.game.endPhase();
        },
        () => this.game.isCurrentPhase("CommandPhase") || this.game.isCurrentPhase("TurnInitPhase"),
      );
    }

    if (this.game.override.disableExpGain) {
      vi.spyOn(activeOverrides, "LEVEL_CAP_OVERRIDE", "get").mockReturnValue(1);
    }

    await this.game.phaseInterceptor.to("CommandPhase");
    console.log("==================[New Turn]==================");
  }
}
