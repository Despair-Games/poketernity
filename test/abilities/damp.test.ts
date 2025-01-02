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
    game.overridesHelper
      .ability(Abilities.DAMP)
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it.each([
    { moveName: "Explosion", move: Moves.EXPLOSION },
    { moveName: "Self-Destruct", move: Moves.SELF_DESTRUCT },
    { moveName: "Misty Explosion", move: Moves.MISTY_EXPLOSION },
    { moveName: "Mind Blown", move: Moves.MIND_BLOWN },
  ])("should prevent the move $moveName from being used", async ({ move }) => {
    game.overridesHelper.moveset([Moves.SPLASH, move]).battleType("double").enemyMoveset(move);
    await game.classicMode.startBattle([Species.FEEBAS, Species.ABRA]);
    const playerPokemon2 = game.scene.getPlayerField()[1];
    const enemyPokemon1 = game.scene.getEnemyField()[0];

    game.moveHelper.select(Moves.SPLASH);
    game.moveHelper.select(move, 1);
    await game.phaseInterceptor.to("BerryPhase");

    const player2MoveResult = playerPokemon2.getMoveHistory()[0];
    const enemy1MoveResult = enemyPokemon1.getMoveHistory()[0];
    expect(player2MoveResult.result).toBe(MoveResult.FAIL);
    expect(enemy1MoveResult.result).toBe(MoveResult.FAIL);
  });

  it("should prevent damage from the ability Aftermath", async () => {
    game.overridesHelper
      .startingLevel(100)
      .moveset(Moves.TACKLE)
      .battleType("single")
      .enemyMoveset([Moves.SPLASH])
      .enemyAbility(Abilities.AFTERMATH);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon();
    const enemyPokemon = game.scene.getEnemyPokemon();

    game.moveHelper.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon?.isFullHp()).toBe(true);
    expect(enemyPokemon?.isFainted()).toBe(true);
  });
});
