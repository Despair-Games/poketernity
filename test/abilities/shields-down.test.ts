import { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Abilities - SHIELDS DOWN", () => {
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

  beforeEach(() => {
    game = new GameManager(phaserGame);
    const moveToUse = MoveId.SPLASH;
    game.override.battleType("single");
    game.override.ability(Abilities.SHIELDS_DOWN);
    game.override.moveset([moveToUse]);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
  });

  test("check if fainted pokemon switched to base form on arena reset", async () => {
    const meteorForm = 0,
      coreForm = 7;
    game.override.startingWave(4);
    game.override.starterForms({
      [Species.MINIOR]: coreForm,
    });

    await game.startBattle([Species.MAGIKARP, Species.MINIOR]);

    const minior = game.scene.getPlayerParty().find((p) => p.species.speciesId === Species.MINIOR)!;
    expect(minior).not.toBe(undefined);
    expect(minior.formIndex).toBe(coreForm);

    minior.faint();
    expect(minior.isFainted()).toBe(true);

    game.move.select(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to(TurnEndPhase);
    game.doSelectModifier();
    await game.phaseInterceptor.to(QuietFormChangePhase);

    expect(minior.formIndex).toBe(meteorForm);
  });
});
