import { AbilityId } from "#enums/ability-id";
import { Gender } from "#enums/gender";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Captivate should give -2 spA to valid opponents", () => {
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
      .battleType("double")
      .startingLevel(100)
      .moveset([MoveId.CAPTIVATE])
      .enemySpecies(SpeciesId.BULBASAUR)
      .enemyLevel(1)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("Captivate should drop stats on valid targets", async () => {
    await game.classicMode.startBattle(SpeciesId.BULBASAUR);
    const playerPokemon = game.scene.getPlayerField()[0];
    playerPokemon.gender = Gender.FEMALE;

    const [enemyA, enemyB] = game.scene.getEnemyField();
    enemyA.gender = Gender.FEMALE;
    enemyB.gender = Gender.MALE;

    game.move.select(MoveId.CAPTIVATE);

    await game.toNextTurn();
    expect(enemyA.getStatStage(Stat.SPATK)).toBe(0);
    expect(enemyB.getStatStage(Stat.SPATK)).toBe(-2);
  });

  it("Captivate does not affect oblivious", async () => {
    game.override.enemyAbility(AbilityId.OBLIVIOUS);
    await game.classicMode.startBattle(SpeciesId.BULBASAUR);
    const playerPokemon = game.scene.getPlayerField()[0];
    playerPokemon.gender = Gender.FEMALE;

    const [enemyA, enemyB] = game.scene.getEnemyField();
    enemyA.gender = Gender.MALE;
    enemyB.gender = Gender.MALE;

    game.move.select(MoveId.CAPTIVATE);

    await game.toNextTurn();
    expect(enemyA.getStatStage(Stat.SPATK)).toBe(0);
    expect(enemyB.getStatStage(Stat.SPATK)).toBe(0);
  });

  it("Captivate succeeds with no effect if user is genderless", async () => {
    await game.classicMode.startBattle(SpeciesId.BULBASAUR);
    const playerPokemon = game.scene.getPlayerField()[0];
    playerPokemon.gender = Gender.GENDERLESS;

    const [enemyA, enemyB] = game.scene.getEnemyField();
    enemyA.gender = Gender.FEMALE;
    enemyB.gender = Gender.MALE;

    game.move.select(MoveId.CAPTIVATE);

    await game.toNextTurn();
    expect(enemyA.getStatStage(Stat.SPATK)).toBe(0);
    expect(enemyB.getStatStage(Stat.SPATK)).toBe(0);
  });
});
