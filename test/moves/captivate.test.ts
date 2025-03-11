import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect } from "vitest";
import { Stat } from "#enums/stat";
import { Gender } from "#enums/gender";

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
      .enemySpecies(Species.BULBASAUR)
      .enemyLevel(1)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("Captivate should drop stats on valid targets", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);
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
    game.override.enemyAbility(Abilities.OBLIVIOUS);
    await game.classicMode.startBattle([Species.BULBASAUR]);
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
    await game.classicMode.startBattle([Species.BULBASAUR]);
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
