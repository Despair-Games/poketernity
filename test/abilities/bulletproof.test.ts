import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Bulletproof", () => {
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
      .ability(Abilities.BULLETPROOF)
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should prevent HP recovery from ally-directed Pollen Puff", async () => {
    game.override.moveset([Moves.POLLEN_PUFF, Moves.SPLASH]).battleType("double");
    await game.classicMode.startBattle([Species.FEEBAS, Species.SLAKOTH]);
    const [playerPokemon1, playerPokemon2] = game.scene.getPlayerField();
    playerPokemon2.hp = 1;

    game.move.select(Moves.POLLEN_PUFF, 0, BattlerIndex.PLAYER_2);
    game.move.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to("BerryPhase");

    const player1LastMove = playerPokemon1.getLastXMoves()[0];
    expect(player1LastMove.result).toBe(MoveResult.FAIL);
    expect(playerPokemon2.hp).toBe(1);
  });
});
