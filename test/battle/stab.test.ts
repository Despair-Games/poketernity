import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("STAB", () => {
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
      .disableCrits()
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .enemySpecies(SpeciesId.BLISSEY)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should have NO STAB (1.0) on type mismatch", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.0);
  });

  it("should have a STAB of 1.5 on type match", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.EMBER);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.5);
  });

  it("should have a 1.5 STAB on tera type not matching default type", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.field.forceTera(playerPokemon, ElementalType.WATER);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.5);
  });

  it("should have a 2.0 STAB on tera type MATCHING default type", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.field.forceTera(playerPokemon, ElementalType.FIRE);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.EMBER);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.0);
  });

  it("should have a 1.2 STAB on Stellar tera- & move-type", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.field.forceTera(playerPokemon, ElementalType.STELLAR);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.TERA_BLAST);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.2);
  });

  it("combined Pledge moves should have a 1.5 STAB regardless of the user's type", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE]);

    const [, enemyPkm2] = game.scene.getEnemyField();
    vi.spyOn(enemyPkm2, "calcStabMultiplierForTakingDamage");

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // Charmander uses Water Pledge, then Squirtle uses Grass Pledge.
    // The combined Pledge is Grass-type, but should still gain STAB.
    game.move.use(MoveId.WATER_PLEDGE, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.GRASS_PLEDGE, 1, BattlerIndex.ENEMY_2);

    // Wait until both Pledges have been used
    for (let i = 0; i < 2; i++) {
      await game.phaseInterceptor.to("PostActionPhase");
    }

    expect(enemyPkm2.calcStabMultiplierForTakingDamage).toHaveLastReturnedWith(1.5);
  });

  it("should have a 1.5 STAB on pledge moves if tera type DOES NOT match user's type", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.field.forceTera(playerPokemon, ElementalType.WATER);

    const [, enemyPkm2] = game.scene.getEnemyField();
    vi.spyOn(enemyPkm2, "calcStabMultiplierForTakingDamage");

    game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // Squirtle uses Grass Pledge, then Charmander uses Water Pledge.
    // The combined Pledge is Grass-type, but should still gain STAB.
    game.move.use(MoveId.WATER_PLEDGE, 0, BattlerIndex.ENEMY_2);
    game.move.use(MoveId.GRASS_PLEDGE, 1, BattlerIndex.ENEMY);

    // Wait until both Pledges have been used
    for (let i = 0; i < 2; i++) {
      await game.phaseInterceptor.to("PostActionPhase");
    }

    expect(enemyPkm2.calcStabMultiplierForTakingDamage).toHaveLastReturnedWith(1.5);
  });

  // combined pledge moves don't get double STAB
  // https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/page-23#post-9433539
  it("should have normal 1.5 STAB on combined pledge moves if tera type matches user's type", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE]);

    const playerPkm = game.field.getPlayerPokemon();
    game.field.forceTera(playerPkm, ElementalType.FIRE);

    const [, enemyPkm2] = game.scene.getEnemyField();
    vi.spyOn(enemyPkm2, "calcStabMultiplierForTakingDamage");

    game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // Squirtle uses Fire Pledge, then Charmander uses Grass Pledge.
    // The combined Pledge is Grass-type
    game.move.use(MoveId.GRASS_PLEDGE, 0, BattlerIndex.ENEMY_2);
    game.move.use(MoveId.WATER_PLEDGE, 1, BattlerIndex.ENEMY);

    // Wait until both Pledges have been used
    for (let i = 0; i < 2; i++) {
      await game.phaseInterceptor.to("PostActionPhase");
    }

    expect(enemyPkm2.calcStabMultiplierForTakingDamage).toHaveLastReturnedWith(1.5);
  });
});
