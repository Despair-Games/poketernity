import { Button } from "#enums/buttons";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { CommandPhase } from "#app/phases/command-phase";
import { FightUiHandler } from "#app/ui/handlers/fight-ui-handler";
import { UiMode } from "#enums/ui-mode";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { MockText } from "#test/test-utils/mocks/mocksContainer/mockText";
import i18next from "i18next";
import { TypeEffectivenessColor } from "#enums/color";

describe("UI - Type Hints", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(async () => {
    game = new GameManager(phaserGame);
    game.settings.typeHints(true); //activate type hints
    game.override.battleType("single").startingLevel(100).startingWave(1).enemyMoveset(MoveId.SPLASH);
  });

  it("check immunity color", async () => {
    game.override
      .battleType("single")
      .startingLevel(100)
      .startingWave(1)
      .enemySpecies(Species.FLORGES)
      .enemyMoveset(MoveId.SPLASH)
      .moveset([MoveId.DRAGON_CLAW]);
    game.settings.typeHints(true); //activate type hints

    await game.startBattle([Species.RAYQUAZA]);

    game.onNextPrompt("CommandPhase", UiMode.COMMAND, () => {
      const { ui } = game.scene;
      const handler = ui.getHandler<FightUiHandler>();
      handler.processInput(Button.ACTION); // select "Fight"
      game.phaseInterceptor.unlock();
    });

    game.onNextPrompt("CommandPhase", UiMode.FIGHT, () => {
      const { ui } = game.scene;
      const movesContainer = ui.getByName<Phaser.GameObjects.Container>(FightUiHandler.MOVES_CONTAINER_NAME);
      const dragonClawText = movesContainer
        .getAll<Phaser.GameObjects.Text>()
        .find((text) => text.text === i18next.t("move:dragonClaw.name"))! as unknown as MockText;

      expect.soft(dragonClawText.color).toBe(TypeEffectivenessColor.NO_EFFECT);
      ui.getHandler().processInput(Button.ACTION);
    });
    await game.phaseInterceptor.to(CommandPhase);
  });

  it("check status move color", async () => {
    game.override.enemySpecies(Species.FLORGES).moveset([MoveId.GROWL]);

    await game.startBattle([Species.RAYQUAZA]);

    game.onNextPrompt("CommandPhase", UiMode.COMMAND, () => {
      const { ui } = game.scene;
      const handler = ui.getHandler<FightUiHandler>();
      handler.processInput(Button.ACTION); // select "Fight"
      game.phaseInterceptor.unlock();
    });

    game.onNextPrompt("CommandPhase", UiMode.FIGHT, () => {
      const { ui } = game.scene;
      const movesContainer = ui.getByName<Phaser.GameObjects.Container>(FightUiHandler.MOVES_CONTAINER_NAME);
      const growlText = movesContainer
        .getAll<Phaser.GameObjects.Text>()
        .find((text) => text.text === i18next.t("move:growl.name"))! as unknown as MockText;

      expect.soft(growlText.color).toBe(undefined);
      ui.getHandler().processInput(Button.ACTION);
    });
    await game.phaseInterceptor.to(CommandPhase);
  });
});
