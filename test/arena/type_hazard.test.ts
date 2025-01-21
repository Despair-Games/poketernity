import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { toDmgValue } from "#app/utils";

describe("Arena - Type Hazards", () => {
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
      .battleType("single")
      .moveset([Moves.STEALTH_ROCK, Moves.G_MAX_STEELSURGE, Moves.ROAR, Moves.SPLASH])
      .enemyMoveset(Moves.SPLASH)
      .enemySpecies(Species.RAMPARDOS);
  });

  it("should not damage the team that set them", async () => {
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(Moves.STEALTH_ROCK);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    const player = game.scene.getPlayerParty()[0];
    expect(player.hp).toBe(player.getMaxHp());
  }, 20000);

  it("should damage opposing pokemon that are forced to switch in", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(Moves.STEALTH_ROCK);
    await game.toNextTurn();

    game.move.select(Moves.ROAR);
    await game.toNextTurn();

    const enemy = game.scene.getEnemyParty()[0];
    const damage = enemy.getMaxHp() - enemy.hp;
    expect(damage).toBe(toDmgValue(enemy.getMaxHp() / 8));
  }, 20000);

  it("should damage opposing pokemon that choose to switch in", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(Moves.STEALTH_ROCK);
    await game.toNextTurn();

    game.move.select(Moves.SPLASH);
    game.forceEnemyToSwitch();
    await game.toNextTurn();

    const enemy = game.scene.getEnemyParty()[0];
    const damage = enemy.getMaxHp() - enemy.hp;
    expect(damage).toBe(toDmgValue(enemy.getMaxHp() / 8));
  }, 20000);

  it("should not damage opposing pokemon with magic guard", async () => {
    game.override.startingWave(5);
    game.override.enemyAbility(Abilities.MAGIC_GUARD);
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(Moves.STEALTH_ROCK);
    await game.toNextTurn();

    game.move.select(Moves.SPLASH);
    game.forceEnemyToSwitch();
    await game.toNextTurn();

    const enemy = game.scene.getEnemyParty()[0];
    const damage = enemy.getMaxHp() - enemy.hp;
    expect(damage).toBe(0);
  }, 20000);

  it("should respect type matchups", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(Moves.G_MAX_STEELSURGE);
    await game.toNextTurn();

    game.move.select(Moves.SPLASH);
    game.forceEnemyToSwitch();
    await game.toNextTurn();

    const enemy = game.scene.getEnemyParty()[0];
    const damage = enemy.getMaxHp() - enemy.hp;
    expect(damage).toBe(toDmgValue(enemy.getMaxHp() / 4));
  }, 20000);
});
