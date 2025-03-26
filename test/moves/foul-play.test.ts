import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should use the target's Attack stat to calculate damage", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const foulPlay = allMoves.get(MoveId.FOUL_PLAY);

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
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const foulPlay = allMoves.get(MoveId.FOUL_PLAY);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = player.getAttackDamage(enemy, foulPlay);

    game.move.use(MoveId.SWORDS_DANCE);

    await game.toNextTurn();

    const { damage: postDamage } = player.getAttackDamage(enemy, foulPlay);

    expect(postDamage).toBeGreaterThan(2 * preDamage - 3);
    expect(postDamage).toBeLessThan(2 * preDamage + 3);
  });

  it("should only apply the user's Attack stat multipliers from abilities for damage", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const foulPlay = allMoves.get(MoveId.FOUL_PLAY);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, foulPlay);

    game.override.ability(AbilityId.HUSTLE).enemyAbility(AbilityId.HUGE_POWER);

    const { damage: postDamage } = enemy.getAttackDamage(player, foulPlay);

    expect(postDamage).toBeGreaterThan(1.5 * preDamage - 3);
    expect(postDamage).toBeLessThan(1.5 * preDamage + 3);
  });

  it("should apply damage reduction from the user's burn and not the target's", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const foulPlay = allMoves.get(MoveId.FOUL_PLAY);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    const { damage: preDamage } = enemy.getAttackDamage(player, foulPlay);

    game.move.use(MoveId.SIZZLY_SLIDE);
    await game.toNextTurn();

    const { damage: oppBurnedDamage } = enemy.getAttackDamage(player, foulPlay);

    expect(oppBurnedDamage).toBe(preDamage);

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SIZZLY_SLIDE);
    await game.toNextTurn();

    const { damage: userBurnedDamage } = enemy.getAttackDamage(player, foulPlay);

    expect(userBurnedDamage).toBeGreaterThan(0.5 * preDamage - 3);
    expect(userBurnedDamage).toBeLessThan(0.5 * preDamage + 3);
  });
});
