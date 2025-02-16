import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Nature Power", () => {
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
      .moveset([MoveId.NATURE_POWER])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should call Round in the Town biome", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.NATURE_POWER);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(game.field.getPlayerPokemon().getLastXMoves()[0].move.id).toBe(MoveId.ROUND);
  });

  it("should call Thunderbolt in electric terrain, overriding the Biome-defined move", async () => {
    game.override.ability(Abilities.ELECTRIC_SURGE);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.NATURE_POWER);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(game.field.getPlayerPokemon().getLastXMoves()[0].move.id).toBe(MoveId.THUNDERBOLT);
  });
});
