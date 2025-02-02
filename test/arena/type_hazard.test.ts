import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
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
      .moveset([MoveId.STEALTH_ROCK, MoveId.G_MAX_STEELSURGE, MoveId.ROAR, MoveId.SPLASH])
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(Species.RAMPARDOS);
  });

  it("should not damage the team that set them", async () => {
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(MoveId.STEALTH_ROCK);
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

    game.move.select(MoveId.STEALTH_ROCK);
    await game.toNextTurn();

    game.move.select(MoveId.ROAR);
    await game.toNextTurn();

    const enemy = game.scene.getEnemyParty()[0];
    const damage = enemy.getMaxHp() - enemy.hp;
    expect(damage).toBe(toDmgValue(enemy.getMaxHp() / 8));
  }, 20000);

  it("should damage opposing pokemon that choose to switch in", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(MoveId.STEALTH_ROCK);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
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

    game.move.select(MoveId.STEALTH_ROCK);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    game.forceEnemyToSwitch();
    await game.toNextTurn();

    const enemy = game.scene.getEnemyParty()[0];
    const damage = enemy.getMaxHp() - enemy.hp;
    expect(damage).toBe(0);
  }, 20000);

  it("should respect type matchups", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.ABRA, Species.ABRA]);

    game.move.select(MoveId.G_MAX_STEELSURGE);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    game.forceEnemyToSwitch();
    await game.toNextTurn();

    const enemy = game.scene.getEnemyParty()[0];
    const damage = enemy.getMaxHp() - enemy.hp;
    expect(damage).toBe(toDmgValue(enemy.getMaxHp() / 4));
  }, 20000);
});
