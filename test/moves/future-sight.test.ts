import { allMoves } from "#app/data/data-lists";
import { MetronomeAttr } from "#app/data/moves/move-attrs/metronome-attr";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

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
      .moveset([MoveId.FUTURE_SIGHT, MoveId.SPLASH, MoveId.DOOM_DESIRE])
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  const passTurns = async (numTurns: number, double: boolean = false) => {
    for (let i = 0; i < numTurns; i++) {
      game.move.select(MoveId.SPLASH, 0);
      if (double) {
        game.move.select(MoveId.SPLASH, 1);
        await game.toEndOfTurn();
      }
      await game.toNextTurn();
    }
  };

  it("should hit 2 turns after use", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(enemy.isFullHp()).toBeTruthy();
    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    expect(enemy.isFullHp()).toBeFalsy();
  });

  it("should not be cancelled after the user switches out", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    game.move.select(MoveId.FUTURE_SIGHT);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    await passTurns(1);

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBe(false);
  });

  it("should inflict damage as a Psychic-type move", async () => {
    game.override.enemySpecies(SpeciesId.UMBREON);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    game.move.select(MoveId.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBeTruthy();
    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
  });

  it("should inflict damage as a Normal-type move if the user is active with Normalize", async () => {
    game.override.ability(AbilityId.NORMALIZE).enemySpecies(SpeciesId.DUSCLOPS);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    game.move.select(MoveId.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBeTruthy();
    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
  });

  it("the target should endure inflicted damage from this move with Sturdy", async () => {
    game.override.enemyAbility(AbilityId.STURDY).enemyLevel(1);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.select(MoveId.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2);

    const enemy = game.scene.getEnemyPokemon()!;

    expect(enemy.hp).toBe(1);
  });

  it("can be used twice in the same turn against different targets", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(MoveId.FUTURE_SIGHT, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.FUTURE_SIGHT, 1, BattlerIndex.ENEMY_2);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();
    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeTruthy());

    await passTurns(2, true);

    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeFalsy());
  });

  it("cannot be used twice in the same turn against the same target", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();

    game.move.select(MoveId.FUTURE_SIGHT, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.FUTURE_SIGHT, 1, BattlerIndex.ENEMY);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();
    expect(playerPokemon[1].getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
  });

  it("can be used alongside Doom Desire against different targets", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(MoveId.DOOM_DESIRE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.FUTURE_SIGHT, 1, BattlerIndex.ENEMY_2);
    await game.toEndOfTurn();

    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeTruthy());
    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(2, true);

    enemyPokemon.forEach((p) => expect(p.isFullHp()).toBeFalsy());
  });

  it("should redirect damage if no Pokemon is active in the original targeted index", async () => {
    game.override.battleType("double").enemyLevel(1).moveset([MoveId.FUTURE_SIGHT, MoveId.SPLASH, MoveId.HEADBUTT]);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(MoveId.FUTURE_SIGHT, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTag(ArenaTagType.DELAYED_ATTACK)).toBeDefined();

    await passTurns(1, true);

    game.move.select(MoveId.HEADBUTT, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(enemyPokemon[0].isFainted()).toBeTruthy();
    expect(enemyPokemon[1].isFullHp()).toBeTruthy();

    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(enemyPokemon[1].isFainted()).toBeTruthy();
  });

  it("doesn't crash if the user leaves the field and the hit triggers Destiny Bond", async () => {
    game.override.enemyMoveset([MoveId.DESTINY_BOND, MoveId.SPLASH]).enemyAbility(AbilityId.BALL_FETCH).enemyLevel(1);
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();

    game.move.select(MoveId.FUTURE_SIGHT);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.DESTINY_BOND);
    await game.phaseInterceptor.to("SelectModifierPhase", false);

    expect(game.scene.getPlayerPokemon()!.species.speciesId).toBe(SpeciesId.MILOTIC);
    expect(milotic.isFullHp()).toBe(true);
    expect(feebas.isFullHp()).toBe(true);
  });

  it("doesn't crash if the user leaves the field and the hit triggers Innards Out", async () => {
    game.override.enemyAbility(AbilityId.INNARDS_OUT).enemyLevel(1);
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();

    game.move.select(MoveId.FUTURE_SIGHT);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("SelectModifierPhase", false);

    expect(game.scene.getPlayerPokemon()!.species.speciesId).toBe(SpeciesId.MILOTIC);
    expect(milotic.isFullHp()).toBe(true);
    expect(feebas.isFullHp()).toBe(true);
  });

  // TODO: Implement these properties and fill in these tests

  it.todo("should not apply the user's abilities when dealing damage if the user is inactive");

  it.todo("should not apply the user's held items when dealing damage if the user is inactive");

  it.todo("should invoke the move's first phase when called by Metronome", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const randomMoveAttr = allMoves.get(MoveId.METRONOME).getAttrs(MetronomeAttr)[0];
    vi.spyOn(randomMoveAttr, "getRandomMove").mockReturnValue(MoveId.FUTURE_SIGHT);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.METRONOME);
    await game.toNextTurn();

    expect(enemy.isFullHp()).toBe(true);
  });
});
