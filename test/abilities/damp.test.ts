import { MoveResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
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

  it("Damp should prevent all Pokemon from using self-KO attacking moves", async () => {
    game.override.moveset([Moves.SPLASH, Moves.EXPLOSION]).battleType("double").enemyMoveset([Moves.EXPLOSION]);
    await game.classicMode.startBattle([Species.FEEBAS, Species.ABRA]);
    const playerPokemon2 = game.scene.getPlayerField()[1];
    const enemyPokemon1 = game.scene.getEnemyField()[0];

    game.move.select(Moves.SPLASH);
    game.move.select(Moves.EXPLOSION, 1);
    await game.phaseInterceptor.to("BerryPhase");

    const player2MoveResult = playerPokemon2.getMoveHistory()[0];
    const enemy1MoveResult = enemyPokemon1.getMoveHistory()[0];
    expect(player2MoveResult.result).toBe(MoveResult.FAIL);
    expect(enemy1MoveResult.result).toBe(MoveResult.FAIL);
  });

  it("Damp should prevent damage from the ability Aftermath", async () => {
    game.override
      .startingLevel(100)
      .moveset(Moves.TACKLE)
      .battleType("single")
      .enemyMoveset([Moves.SPLASH])
      .enemyAbility(Abilities.AFTERMATH);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon();
    const enemyPokemon = game.scene.getEnemyPokemon();

    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon?.isFullHp()).toBe(true);
    expect(enemyPokemon?.isFainted()).toBe(true);
  });
});
