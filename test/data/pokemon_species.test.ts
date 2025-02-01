import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it } from "vitest";
import { Pokedex } from "./smogon_data";

describe("Data - Pokemon Species", () => {
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
      .moveset([Moves.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  const enum GrowthRate_PokeAPI {
    SLOW = 1,
    MEDIUM,
    FAST,
    MEDIUM_SLOW,
    SLOW_THEN_VERY_FAST,
    FAST_THEN_VERY_SLOW,
  }

  // From PokeAPI, growth rate, shape, capture rate, base friendship

  it("should do X", async () => {
    console.log(Object.keys(Pokedex));
    console.log(GrowthRate_PokeAPI["SLOW"]);
  });
});
