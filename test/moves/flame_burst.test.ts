import { BattlerIndex } from "#app/battle";
import { allAbilities } from "#app/data/ability";
import { Abilities } from "#enums/abilities";
import type Pokemon from "#app/field/pokemon";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Flame Burst", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  /**
   * Calculates the effect damage of Flame Burst which is 1/16 of the target ally's max HP
   * See Flame Burst {@link https://bulbapedia.bulbagarden.net/wiki/Flame_Burst_(move)}
   * See Flame Burst's move attribute {@linkcode FlameBurstAttr}
   * @param pokemon {@linkcode Pokemon} - The ally of the move's target
   * @returns Effect damage of Flame Burst
   */
  const getEffectDamage = (pokemon: Pokemon): number => {
    return Math.max(1, Math.floor((pokemon.getMaxHp() * 1) / 16));
  };

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
    game.override.battleType("double");
    game.override.moveset([Moves.FLAME_BURST, Moves.SPLASH]);
    game.override.disableCrits();
    game.override.ability(Abilities.UNNERVE);
    game.override.startingWave(4);
    game.override.enemySpecies(Species.SHUCKLE);
    game.override.enemyAbility(Abilities.BALL_FETCH);
    game.override.enemyMoveset([Moves.SPLASH]);
  });

  it("inflicts damage to the target's ally equal to 1/16 of its max HP", async () => {
    await game.classicMode.startBattle([Species.PIKACHU, Species.PIKACHU]);
    const [leftEnemy, rightEnemy] = game.scene.getEnemyField();

    game.move.select(Moves.FLAME_BURST, 0, leftEnemy.getBattlerIndex());
    game.move.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(leftEnemy.hp).toBeLessThan(leftEnemy.getMaxHp());
    expect(rightEnemy.hp).toBe(rightEnemy.getMaxHp() - getEffectDamage(rightEnemy));
  });

  it("does not inflict damage to the target's ally if the target was not affected by Flame Burst", async () => {
    game.override.enemyAbility(Abilities.FLASH_FIRE);

    await game.classicMode.startBattle([Species.PIKACHU, Species.PIKACHU]);
    const [leftEnemy, rightEnemy] = game.scene.getEnemyField();

    game.move.select(Moves.FLAME_BURST, 0, leftEnemy.getBattlerIndex());
    game.move.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(leftEnemy.hp).toBe(leftEnemy.getMaxHp());
    expect(rightEnemy.hp).toBe(rightEnemy.getMaxHp());
  });

  it("does not interact with the target ally's abilities", async () => {
    await game.classicMode.startBattle([Species.PIKACHU, Species.PIKACHU]);
    const [leftEnemy, rightEnemy] = game.scene.getEnemyField();

    vi.spyOn(rightEnemy, "getAbility").mockReturnValue(allAbilities[Abilities.FLASH_FIRE]);

    game.move.select(Moves.FLAME_BURST, 0, leftEnemy.getBattlerIndex());
    game.move.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(leftEnemy.hp).toBeLessThan(leftEnemy.getMaxHp());
    expect(rightEnemy.hp).toBe(rightEnemy.getMaxHp() - getEffectDamage(rightEnemy));
  });

  it("effect damage is prevented by Magic Guard", async () => {
    await game.classicMode.startBattle([Species.PIKACHU, Species.PIKACHU]);
    const [leftEnemy, rightEnemy] = game.scene.getEnemyField();

    vi.spyOn(rightEnemy, "getAbility").mockReturnValue(allAbilities[Abilities.MAGIC_GUARD]);

    game.move.select(Moves.FLAME_BURST, 0, leftEnemy.getBattlerIndex());
    game.move.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(leftEnemy.hp).toBeLessThan(leftEnemy.getMaxHp());
    expect(rightEnemy.hp).toBe(rightEnemy.getMaxHp());
  });

  it("effect damage should apply even when targeting a Substitute", async () => {
    game.override.enemyMoveset([Moves.SUBSTITUTE, Moves.SPLASH]);

    await game.classicMode.startBattle([Species.PIKACHU, Species.PIKACHU]);
    const [leftEnemy, rightEnemy] = game.scene.getEnemyField();

    game.move.select(Moves.FLAME_BURST, 0, leftEnemy.getBattlerIndex());
    game.move.select(Moves.SPLASH, 1);

    await game.forceEnemyMove(Moves.SUBSTITUTE);
    await game.forceEnemyMove(Moves.SPLASH);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(rightEnemy.hp).toBe(rightEnemy.getMaxHp() - getEffectDamage(rightEnemy));
  });

  it("effect damage should bypass protection", async () => {
    game.override.enemyMoveset([Moves.PROTECT, Moves.SPLASH]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const leftEnemy = game.scene.getEnemyField()[0];

    game.move.select(Moves.FLAME_BURST, 0, BattlerIndex.ENEMY_2);
    game.move.select(Moves.SPLASH, 1);

    await game.forceEnemyMove(Moves.PROTECT);
    await game.forceEnemyMove(Moves.SPLASH);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(leftEnemy.hp).toBe(leftEnemy.getMaxHp() - getEffectDamage(leftEnemy));
  });

  // TODO: fix Endure's interactions with effect damage to pass this test
  it.skip("effect damage should bypass Endure", async () => {
    game.override.enemyMoveset([Moves.ENDURE, Moves.SPLASH]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const leftEnemy = game.scene.getEnemyField()[0];
    leftEnemy.hp = 1;

    game.move.select(Moves.FLAME_BURST, 0, BattlerIndex.ENEMY_2);
    game.move.select(Moves.SPLASH, 1);

    await game.forceEnemyMove(Moves.ENDURE);
    await game.forceEnemyMove(Moves.SPLASH);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(leftEnemy.isFainted(true)).toBeTruthy();
  });
});
