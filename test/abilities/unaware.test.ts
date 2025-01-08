import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { EFFECTIVE_STATS, Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Unaware", () => {
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
      .ability(Abilities.UNAWARE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it("should ignore the opponent's stat stages, except for speed", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.SHELL_SMASH);
    await game.toNextTurn();

    const playerPokemon = game.pokemonHelper.getPlayerPokemon();
    const enemyPokemon = game.pokemonHelper.getEnemyPokemon();
    for (const stat of EFFECTIVE_STATS) {
      let expectedStat = enemyPokemon.getStat(stat);
      if (stat === Stat.SPD) {
        expectedStat = expectedStat * 2; // Should not ignore stat stages in Speed
      }

      const actualStat = enemyPokemon.getEffectiveStat(stat, playerPokemon);
      expect(actualStat).toBe(expectedStat);
    }
  });

  it("should not ignore the user's stat stages", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(Moves.SHELL_SMASH);
    await game.move.forceEnemyMove(Moves.SPLASH);
    await game.toNextTurn();

    const playerPokemon = game.pokemonHelper.getPlayerPokemon();
    const enemyPokemon = game.pokemonHelper.getEnemyPokemon();
    for (const stat of EFFECTIVE_STATS) {
      let expectedStat = playerPokemon.getStat(stat);
      if ([Stat.ATK, Stat.SPATK, Stat.SPD].includes(stat)) {
        expectedStat = expectedStat * 2;
      } else if ([Stat.DEF, Stat.SPDEF].includes(stat)) {
        expectedStat = Math.floor((expectedStat * 2) / 3);
      }

      const actualStat = playerPokemon.getEffectiveStat(stat, enemyPokemon);
      expect(actualStat).toBe(expectedStat);
    }
  });
});
