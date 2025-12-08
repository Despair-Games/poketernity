import { BattleStyle } from "#enums/battle-style";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import type { GameManager } from "#test/test-utils/game-manager";
import { GameManagerHelper } from "#test/test-utils/helpers/game-manager-helper";
import type { SessionSaveData } from "#types/session-data";
import { vi } from "vitest";

/**
 * Helper to allow reloading sessions in unit tests.
 */
export class ReloadHelper extends GameManagerHelper {
  sessionData: SessionSaveData;

  constructor(game: GameManager) {
    super(game);

    // Whenever the game saves the session, save it to the reloadHelper instead
    vi.spyOn(game.scene.gameData, "saveAll").mockImplementation(() => {
      return new Promise<boolean>((resolve, _reject) => {
        this.sessionData = game.scene.gameData.getSessionSaveData();
        resolve(true);
      });
    });
  }

  /**
   * Simulate reloading the session from the title screen, until reaching the
   * beginning of the first turn (equivalent to running `startBattle()`) for
   * the reloaded session.
   */
  async reloadSession(): Promise<void> {
    const { scene, phaseInterceptor } = this.game;
    const titlePhase = scene.phaseManager.createPhase("TitlePhase");

    scene.phaseManager.clear();

    // Set the last saved session to the desired session data
    vi.spyOn(scene.gameData, "getSession").mockReturnValue(
      new Promise((resolve, _reject) => {
        resolve(this.sessionData);
      }),
    );
    scene.phaseManager.unshiftPhase(titlePhase);
    phaseInterceptor.superEndPhase(); // End the currently ongoing battle

    titlePhase.loadSaveSlot(-1); // Load the desired session data
    phaseInterceptor.shift(); // Loading the save slot also ended TitlePhase, clean it up

    // Run through prompts for switching Pokemon, copied from classicModeHelper.ts
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

    await phaseInterceptor.to("CommandPhase");
    console.log("==================[New Turn]==================");
  }
}
