import { Abilities } from "#enums/abilities";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Anticipation", () => {
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
      .ability(Abilities.ANTICIPATION)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  it("should activate when the opponent has a super-effective move", async () => {
    game.override.enemyMoveset(MoveId.ABSORB);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied[0]).toBe(Abilities.ANTICIPATION);
  });

  it("should activate when the opponent has a 1HKO move", async () => {
    game.override.enemyMoveset(MoveId.FISSURE);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied[0]).toBe(Abilities.ANTICIPATION);
  });

  it("should not activate when the opponent does not have a super-effective or 1HKO move", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied.length).toBe(0);
  });

  it("should consider Hidden Power's calculated type, not its default Normal type", async () => {
    game.override.enemyMoveset(MoveId.HIDDEN_POWER).enemyIVs([31, 31, 31, 30, 31, 31]);
    // Hidden Power type set to Electric here
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(enemyPokemon.getMoveType(enemyPokemon.getMoveset()[0].getMove())).toBe(ElementalType.ELECTRIC);
    expect(playerPokemon.battleData.abilitiesApplied[0]).toBe(Abilities.ANTICIPATION);
  });

  it("should not consider most variable-type moves' calculated type", async () => {
    game.override.enemySpecies(Species.PIKACHU).enemyMoveset(MoveId.REVELATION_DANCE);

    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(enemyPokemon.getMoveType(enemyPokemon.getMoveset()[0].getMove())).toBe(ElementalType.ELECTRIC);
    expect(playerPokemon.battleData.abilitiesApplied.length).toBe(0);
  });
});
