import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Foul Play", () => {
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should use the target's Attack stat to calculate damage", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const foulPlay = allMoves[Moves.FOUL_PLAY];

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    vi.spyOn(enemy, "stats", "get").mockReturnValue(Array(6).fill(100));

    const { damage: preDamage } = enemy.getAttackDamage(player, foulPlay);

    // double the enemy's Attack
    vi.spyOn(enemy, "stats", "get").mockReturnValue([100, 200, 100, 100, 100, 100]);

    const { damage: postDamage } = enemy.getAttackDamage(player, foulPlay);

    expect(postDamage).toBeGreaterThan(2 * preDamage - 3);
    expect(postDamage).toBeLessThan(2 * preDamage + 3);
  });

  it("should use the target's Attack stat stages during damage calculation", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const foulPlay = allMoves[Moves.FOUL_PLAY];

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = player.getAttackDamage(enemy, foulPlay);

    game.move.use(Moves.SWORDS_DANCE);

    await game.toNextTurn();

    const { damage: postDamage } = player.getAttackDamage(enemy, foulPlay);

    expect(postDamage).toBeGreaterThan(2 * preDamage - 3);
    expect(postDamage).toBeLessThan(2 * preDamage + 3);
  });

  it("should only apply the user's Attack stat multipliers from abilities for damage", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const foulPlay = allMoves[Moves.FOUL_PLAY];

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, foulPlay);

    game.override.ability(Abilities.HUSTLE).enemyAbility(Abilities.HUGE_POWER);

    const { damage: postDamage } = enemy.getAttackDamage(player, foulPlay);

    expect(postDamage).toBeGreaterThan(1.5 * preDamage - 3);
    expect(postDamage).toBeLessThan(1.5 * preDamage + 3);
  });

  it("should apply damage reduction from the user's burn and not the target's", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const foulPlay = allMoves[Moves.FOUL_PLAY];

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, foulPlay);

    game.move.use(Moves.SIZZLY_SLIDE);
    await game.toNextTurn();

    const { damage: oppBurnedDamage } = enemy.getAttackDamage(player, foulPlay);

    expect(oppBurnedDamage).toBe(preDamage);

    game.move.use(Moves.SPLASH);
    await game.move.forceEnemyMove(Moves.SIZZLY_SLIDE);
    await game.toNextTurn();

    const { damage: userBurnedDamage } = enemy.getAttackDamage(player, foulPlay);

    expect(userBurnedDamage).toBeGreaterThan(0.5 * preDamage - 3);
    expect(userBurnedDamage).toBeLessThan(0.5 * preDamage + 3);
  });
});
