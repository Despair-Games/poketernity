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

/**
 * Helper to handle classic mode specifics
 */
export class ClassicModeHelper extends GameManagerHelper {
  /**
   * Runs the classic game to the summon phase.
   * @param species - Optional array of species to summon.
   * @returns A promise that resolves when the summon phase is reached.
   */
  async runToSummon(species?: SpeciesId[]): Promise<void> {
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
      const starters = generateStarter(this.game.scene, species);
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
   * @param species - Optional array of species to start the battle with.
   * @returns A promise that resolves when the battle is started.
   */
  async startBattle(species?: SpeciesId[]): Promise<void> {
    await this.runToSummon(species);

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

    await this.game.phaseInterceptor.to("CommandPhase");
    console.log("==================[New Turn]==================");
  }
}
