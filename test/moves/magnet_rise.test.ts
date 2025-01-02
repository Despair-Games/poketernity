import { CommandPhase } from "#app/phases/command-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Magnet Rise", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const moveToUse = Moves.MAGNET_RISE;

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
    game.overridesHelper.battleType("single");
    game.overridesHelper.starterSpecies(Species.MAGNEZONE);
    game.overridesHelper.enemySpecies(Species.RATTATA);
    game.overridesHelper.enemyMoveset([Moves.DRILL_RUN, Moves.DRILL_RUN, Moves.DRILL_RUN, Moves.DRILL_RUN]);
    game.overridesHelper.disableCrits();
    game.overridesHelper.enemyLevel(1);
    game.overridesHelper.moveset([moveToUse, Moves.SPLASH, Moves.GRAVITY, Moves.BATON_PASS]);
  });

  it("MAGNET RISE", async () => {
    await game.startBattle();

    const startingHp = game.scene.getPlayerParty()[0].hp;
    game.moveHelper.select(moveToUse);
    await game.phaseInterceptor.to(TurnEndPhase);
    const finalHp = game.scene.getPlayerParty()[0].hp;
    const hpLost = finalHp - startingHp;
    expect(hpLost).toBe(0);
  }, 20000);

  it("MAGNET RISE - Gravity", async () => {
    await game.startBattle();

    const startingHp = game.scene.getPlayerParty()[0].hp;
    game.moveHelper.select(moveToUse);
    await game.phaseInterceptor.to(CommandPhase);
    let finalHp = game.scene.getPlayerParty()[0].hp;
    let hpLost = finalHp - startingHp;
    expect(hpLost).toBe(0);
    game.moveHelper.select(Moves.GRAVITY);
    await game.phaseInterceptor.to(TurnEndPhase);
    finalHp = game.scene.getPlayerParty()[0].hp;
    hpLost = finalHp - startingHp;
    expect(hpLost).not.toBe(0);
  }, 20000);
});
