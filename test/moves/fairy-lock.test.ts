import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Fairy Lock", () => {
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
      .moveset([MoveId.FAIRY_LOCK, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .battleType("double")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SPLASH, MoveId.U_TURN]);
  });

  it("Applies Fairy Lock tag for two turns", async () => {
    await game.classicMode.startBattle(SpeciesId.KLEFKI, SpeciesId.TYRUNT);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);

    await game.toEndOfTurn();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeTruthy();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeTruthy();

    await game.toNextTurn();

    game.scene.getField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(true);
    });

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);

    await game.toNextTurn();
    game.scene.getField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(false);
    });
  });

  it("Ghost types can escape Fairy Lock", async () => {
    await game.classicMode.startBattle(SpeciesId.DUSKNOIR, SpeciesId.GENGAR, SpeciesId.TYRUNT);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeTruthy();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeTruthy();

    await game.toNextTurn();

    game.scene.getPlayerField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(false);
    });

    game.move.select(MoveId.SPLASH);
    game.switchPokemon(2);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();
    await game.toNextTurn();

    expect(game.scene.getPlayerField()[1].species.speciesId).not.toBe(SpeciesId.GENGAR);
  });

  it("Phasing moves will still switch out", async () => {
    game.override.enemyMoveset([MoveId.SPLASH, MoveId.WHIRLWIND]);
    await game.classicMode.startBattle(SpeciesId.KLEFKI, SpeciesId.TYRUNT, SpeciesId.ZYGARDE);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeTruthy();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeTruthy();

    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.WHIRLWIND, 0);
    game.selectPartyPokemon(2);
    await game.move.selectEnemyMove(MoveId.WHIRLWIND, 1);
    game.selectPartyPokemon(2);
    await game.toEndOfTurn();
    await game.toNextTurn();

    expect(game.scene.getPlayerField()[0].species.speciesId).not.toBe(SpeciesId.KLEFKI);
    expect(game.scene.getPlayerField()[1].species.speciesId).not.toBe(SpeciesId.TYRUNT);
  });

  it("If a Pokemon faints and is replaced the replacement is also trapped", async () => {
    game.override.moveset([MoveId.FAIRY_LOCK, MoveId.SPLASH, MoveId.MEMENTO]);
    await game.classicMode.startBattle(SpeciesId.KLEFKI, SpeciesId.GUZZLORD, SpeciesId.TYRUNT, SpeciesId.ZYGARDE);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.MEMENTO, 1);
    game.selectPartyPokemon(2);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeTruthy();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeTruthy();

    await game.toNextTurn();

    game.scene.getField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(true);
    });

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();
  });

  it("should apply even if the field is empty", async () => {
    await game.classicMode.startBattle(SpeciesId.KLEFKI, SpeciesId.GUZZLORD, SpeciesId.TYRUNT, SpeciesId.ZYGARDE);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.move.use(MoveId.FAIRY_LOCK);
    game.move.use(MoveId.MEMENTO, 1, BattlerIndex.PLAYER);
    await game.move.selectEnemyMove(MoveId.MEMENTO, BattlerIndex.PLAYER);
    await game.move.selectEnemyMove(MoveId.MEMENTO, BattlerIndex.PLAYER);
    game.selectPartyPokemon(2);
    game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER]);

    // Allow all 3 targets to use Memento
    await game.phaseInterceptor.to("PostActionPhase");
    await game.phaseInterceptor.to("PostActionPhase");
    await game.phaseInterceptor.to("PostActionPhase");

    expect(playerPokemon[1].isFainted()).toBe(true);
    expect(enemyPokemon[0].isFainted()).toBe(true);
    expect(enemyPokemon[1].isFainted()).toBe(true);

    await game.toEndOfTurn();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeTruthy();
    expect(game.scene.arena.hasTag(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeTruthy();
    expect(playerPokemon[0].isTrapped()).toBe(true);
  });
});
