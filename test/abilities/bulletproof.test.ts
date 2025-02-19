import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";
import { MoveId } from "#enums/move-id";
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
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should prevent HP recovery from ally-directed Pollen Puff", async () => {
    game.override.moveset([MoveId.POLLEN_PUFF, MoveId.SPLASH]).battleType("double");
    await game.classicMode.startBattle([Species.FEEBAS, Species.SLAKOTH]);
    const [playerPokemon1, playerPokemon2] = game.scene.getPlayerField();
    playerPokemon2.hp = 1;

    game.move.select(MoveId.POLLEN_PUFF, 0, BattlerIndex.PLAYER_2);
    game.move.select(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    const player1LastMove = playerPokemon1.getLastXMoves()[0];
    expect(player1LastMove.result).toBe(MoveResult.FAIL);
    expect(playerPokemon2.hp).toBe(1);
  });
});
