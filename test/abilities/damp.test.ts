import { MoveResult } from "#enums/move-result";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Damp", () => {
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
    game.override
      .ability(Abilities.DAMP)
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it.each([
    { moveName: "Explosion", moveId: MoveId.EXPLOSION },
    { moveName: "Self-Destruct", moveId: MoveId.SELF_DESTRUCT },
    { moveName: "Misty Explosion", moveId: MoveId.MISTY_EXPLOSION },
    { moveName: "Mind Blown", moveId: MoveId.MIND_BLOWN },
  ])("should prevent the move $moveName from being used", async ({ moveId }) => {
    game.override.moveset([MoveId.SPLASH, moveId]).battleType("double").enemyMoveset(moveId);
    await game.classicMode.startBattle([Species.FEEBAS, Species.ABRA]);
    const playerPokemon2 = game.scene.getPlayerField()[1];
    const enemyPokemon1 = game.scene.getEnemyField()[0];

    game.move.select(MoveId.SPLASH);
    game.move.select(moveId, 1);
    await game.toEndOfTurn();

    const player2MoveResult = playerPokemon2.getMoveHistory()[0];
    const enemy1MoveResult = enemyPokemon1.getMoveHistory()[0];
    expect(player2MoveResult.result).toBe(MoveResult.FAIL);
    expect(enemy1MoveResult.result).toBe(MoveResult.FAIL);
  });

  it("should prevent damage from the ability Aftermath", async () => {
    game.override
      .startingLevel(100)
      .moveset(MoveId.TACKLE)
      .battleType("single")
      .enemyMoveset([MoveId.SPLASH])
      .enemyAbility(Abilities.AFTERMATH);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon();
    const enemyPokemon = game.scene.getEnemyPokemon();

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(playerPokemon?.isFullHp()).toBe(true);
    expect(enemyPokemon?.isFainted()).toBe(true);
  });
});
