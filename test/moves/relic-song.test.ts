import { ElementalType } from "#enums/elemental-type";
import { Challenges } from "#enums/challenges";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Relic Song", () => {
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
      .moveset([MoveId.RELIC_SONG, MoveId.SPLASH])
      .battleType("single")
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(Species.MAGIKARP)
      .enemyLevel(100);
  });

  it("swaps Meloetta's form between Aria and Pirouette", async () => {
    await game.classicMode.startBattle([Species.MELOETTA]);

    const meloetta = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.RELIC_SONG);
    await game.toNextTurn();

    expect(meloetta.formIndex).toBe(1);

    game.move.select(MoveId.RELIC_SONG);
    await game.toEndOfTurn();

    expect(meloetta.formIndex).toBe(0);
  });

  it("doesn't swap Meloetta's form during a mono-type challenge", async () => {
    game.challengeMode.addChallenge(Challenges.SINGLE_TYPE, ElementalType.PSYCHIC + 1, 0);
    await game.challengeMode.startBattle([Species.MELOETTA]);

    const meloetta = game.scene.getPlayerPokemon()!;

    expect(meloetta.formIndex).toBe(0);

    game.move.select(MoveId.RELIC_SONG);
    await game.toEndOfTurn();
    await game.toNextTurn();

    expect(meloetta.formIndex).toBe(0);
  });

  it("doesn't swap Meloetta's form during biome change (arena reset)", async () => {
    game.override.starterForms({ [Species.MELOETTA]: 1 }).startingWave(10);
    await game.classicMode.startBattle([Species.MELOETTA]);

    const meloetta = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.toNextWave();

    expect(meloetta.formIndex).toBe(1);
  });
});
