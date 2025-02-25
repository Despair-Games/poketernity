import { BattlerIndex } from "#enums/battler-index";
import { isBetween, toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Analytic", () => {
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
      .moveset([MoveId.SPLASH, MoveId.TACKLE])
      .ability(Abilities.ANALYTIC)
      .battleType("single")
      .disableCrits()
      .startingLevel(200)
      .enemyLevel(200)
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should increase damage if the user moves last", async () => {
    await game.classicMode.startBattle([Species.ARCEUS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();
    const damage1 = enemy.getInverseHp();
    enemy.hp = enemy.getMaxHp();

    game.move.select(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();
    expect(isBetween(enemy.getInverseHp(), toDmgValue(damage1 * 1.3) - 3, toDmgValue(damage1 * 1.3) + 3)).toBe(true);
  });

  it("should increase damage only if the user moves last in doubles", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.GENGAR, Species.SHUCKLE]);

    const [enemy] = game.scene.getEnemyField();

    game.move.select(MoveId.TACKLE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toNextTurn();
    const damage1 = enemy.getInverseHp();
    enemy.hp = enemy.getMaxHp();

    game.move.select(MoveId.TACKLE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);
    game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(isBetween(enemy.getInverseHp(), toDmgValue(damage1 * 1.3) - 3, toDmgValue(damage1 * 1.3) + 3)).toBe(true);
    enemy.hp = enemy.getMaxHp();

    game.move.select(MoveId.TACKLE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);
    game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();
    expect(enemy.getInverseHp()).toBe(damage1);
  });
});
