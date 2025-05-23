import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
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
      .ability(AbilityId.BULLETPROOF)
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should prevent HP recovery from ally-directed Pollen Puff", async () => {
    game.override.moveset([MoveId.POLLEN_PUFF, MoveId.SPLASH]).battleType("double");
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.SLAKOTH);
    const [playerPokemon1, playerPokemon2] = game.scene.getPlayerField();
    playerPokemon2.hp = 1;

    game.move.select(MoveId.POLLEN_PUFF, 0, BattlerIndex.PLAYER_2);
    game.move.select(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(playerPokemon1).toHaveMoveResult(MoveResult.FAIL);
    expect(playerPokemon2.hp).toBe(1);
  });
});
