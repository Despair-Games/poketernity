import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Stat } from "#enums/stat";

describe("Abilities - Defeatist", () => {
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
      .moveset([MoveId.SPLASH])
      .ability(Abilities.DEFEATIST)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { statName: "attack", stat: Stat.ATK },
    { statName: "special attack", stat: Stat.SPATK },
  ])("should halve the user's $statName if the user's HP is at or below 50%", async ({ stat }) => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();
    const expectedStat = Math.floor(playerPokemon.getStat(stat as number) / 2);
    playerPokemon.hp = 1;
    const defeatistStat = playerPokemon.getEffectiveStat(stat as number);

    expect(playerPokemon.getHpRatio()).toBeLessThanOrEqual(0.5);
    expect(defeatistStat).toBe(expectedStat);
  });

  it.each([
    { statName: "attack", stat: Stat.ATK },
    { statName: "special attack", stat: Stat.SPATK },
  ])("should have no effect on $statName if the user's HP is above 50%", async ({ stat }) => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();
    const expectedStat = playerPokemon.getStat(stat as number);
    const defeatistStat = playerPokemon.getEffectiveStat(stat as number);

    expect(playerPokemon.getHpRatio()).toBeGreaterThan(0.5);
    expect(defeatistStat).toBe(expectedStat);
  });
});
