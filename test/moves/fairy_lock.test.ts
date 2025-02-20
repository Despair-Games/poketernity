import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#enums/battler-index";

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
      .ability(Abilities.BALL_FETCH)
      .battleType("double")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([MoveId.SPLASH, MoveId.U_TURN]);
  });

  it("Applies Fairy Lock tag for two turns", async () => {
    await game.classicMode.startBattle([Species.KLEFKI, Species.TYRUNT]);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);

    await game.toEndOfTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeDefined();

    await game.toNextTurn();

    game.scene.getField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(true);
    });

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);

    await game.toNextTurn();
    game.scene.getField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(false);
    });
  });

  it("Ghost types can escape Fairy Lock", async () => {
    await game.classicMode.startBattle([Species.DUSKNOIR, Species.GENGAR, Species.TYRUNT]);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeDefined();

    await game.toNextTurn();

    game.scene.getPlayerField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(false);
    });

    game.move.select(MoveId.SPLASH);
    game.doSwitchPokemon(2);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();
    await game.toNextTurn();

    expect(game.scene.getPlayerField()[1].species.speciesId).not.toBe(Species.GENGAR);
  });

  it("Phasing moves will still switch out", async () => {
    game.override.enemyMoveset([MoveId.SPLASH, MoveId.WHIRLWIND]);
    await game.classicMode.startBattle([Species.KLEFKI, Species.TYRUNT, Species.ZYGARDE]);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeDefined();

    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.WHIRLWIND, 0);
    game.doSelectPartyPokemon(2);
    await game.forceEnemyMove(MoveId.WHIRLWIND, 1);
    game.doSelectPartyPokemon(2);
    await game.toEndOfTurn();
    await game.toNextTurn();

    expect(game.scene.getPlayerField()[0].species.speciesId).not.toBe(Species.KLEFKI);
    expect(game.scene.getPlayerField()[1].species.speciesId).not.toBe(Species.TYRUNT);
  });

  it("If a Pokemon faints and is replaced the replacement is also trapped", async () => {
    game.override.moveset([MoveId.FAIRY_LOCK, MoveId.SPLASH, MoveId.MEMENTO]);
    await game.classicMode.startBattle([Species.KLEFKI, Species.GUZZLORD, Species.TYRUNT, Species.ZYGARDE]);

    game.move.select(MoveId.FAIRY_LOCK);
    game.move.select(MoveId.MEMENTO, 1);
    game.doSelectPartyPokemon(2);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeDefined();

    await game.toNextTurn();

    game.scene.getField().forEach((pokemon) => {
      expect(pokemon.isTrapped()).toBe(true);
    });

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.SPLASH, 1);
    await game.toEndOfTurn();
  });

  it("should apply even if the field is empty", async () => {
    await game.classicMode.startBattle([Species.KLEFKI, Species.GUZZLORD, Species.TYRUNT, Species.ZYGARDE]);

    game.move.use(MoveId.FAIRY_LOCK);
    game.move.use(MoveId.MEMENTO, 1, BattlerIndex.PLAYER);
    await game.move.forceEnemyMove(MoveId.MEMENTO, BattlerIndex.PLAYER);
    await game.move.forceEnemyMove(MoveId.MEMENTO, BattlerIndex.PLAYER);
    game.doSelectPartyPokemon(2);
    await game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER]);

    // Allow all 3 targets to use Memento
    await game.phaseInterceptor.to("MoveEndPhase");
    await game.phaseInterceptor.to("MoveEndPhase");
    await game.phaseInterceptor.to("MoveEndPhase");

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();
    expect(playerPokemon[1].isFainted()).toBe(true);
    expect(enemyPokemon[0].isFainted()).toBe(true);
    expect(enemyPokemon[1].isFainted()).toBe(true);

    await game.toEndOfTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.FAIRY_LOCK, ArenaTagSide.ENEMY)).toBeDefined();
    expect(playerPokemon[0].isTrapped()).toBe(true);
  });
});
