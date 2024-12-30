import { BattlerIndex } from "#app/battle";
import { MoveResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Future Sight", () => {
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
      .moveset([Moves.FUTURE_SIGHT, Moves.SPLASH])
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  const passTurns = async (numTurns: number, double: boolean = false) => {
    for (let i = 0; i < numTurns; i++) {
      game.move.select(Moves.SPLASH, 0);
      if (double) {
        game.move.select(Moves.SPLASH, 1);
        await game.phaseInterceptor.to("TurnEndPhase");
      }
      await game.toNextTurn();
    }
  };

  it("should hit 2 turns after use", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(enemy.isFullHp()).toBeTruthy();
    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    expect(enemy.isFullHp()).toBeFalsy();
  });

  it("should not be cancelled after the user switches out", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    await passTurns(1);

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBe(false);
  });

  it("should inflict damage as a Psychic-type move", async () => {
    game.override.enemySpecies(Species.UMBREON);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBeTruthy();
    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
  });

  it("should inflict damage as a Normal-type move if the user is active with Normalize", async () => {
    game.override.ability(Abilities.NORMALIZE).enemySpecies(Species.DUSCLOPS);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBeTruthy();
    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
  });

  it("the target should endure inflicted damage from this move with Sturdy", async () => {
    game.override.enemyAbility(Abilities.STURDY).enemyLevel(1);

    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    const enemy = game.scene.getEnemyPokemon()!;

    expect(enemy.hp).toBe(1);
  });

  it("can be used twice in the same turn against different targets", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(Moves.FUTURE_SIGHT, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.FUTURE_SIGHT, 1, BattlerIndex.ENEMY_2);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();
    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeDefined());

    await passTurns(2, true);

    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeFalsy());
  });

  it("cannot be used twice in the same turn against the same target", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();

    game.move.select(Moves.FUTURE_SIGHT, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.FUTURE_SIGHT, 1, BattlerIndex.ENEMY);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();
    expect(playerPokemon[1].getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
  });

  it("can be used alongside Doom Desire against different targets", async () => {
    game.override.battleType("double").moveset([Moves.FUTURE_SIGHT, Moves.DOOM_DESIRE, Moves.SPLASH]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(Moves.DOOM_DESIRE, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.FUTURE_SIGHT, 1, BattlerIndex.ENEMY_2);
    await game.phaseInterceptor.to("TurnEndPhase");

    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeTruthy());
    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2, true);

    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeFalsy());
  });

  it("should redirect damage if no Pokemon is active in the original targeted index", async () => {
    game.override.battleType("double").enemyLevel(1).moveset([Moves.FUTURE_SIGHT, Moves.SPLASH, Moves.HEADBUTT]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(Moves.FUTURE_SIGHT, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(1, true);

    game.move.select(Moves.HEADBUTT, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.SPLASH, 1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon[0].isFainted()).toBeTruthy();
    expect(enemyPokemon[1].isFullHp()).toBeTruthy();

    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(enemyPokemon[1].isFainted()).toBeTruthy();
  });

  // TODO: Implement these properties and fill in these tests

  it.todo("should not apply the user's abilities when dealing damage if the user is inactive");

  it.todo("should not apply the user's held items when dealing damage if the user is inactive");

  it.todo("should invoke the move's first phase when called by Metronome");
});
