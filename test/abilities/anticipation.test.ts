import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import { Challenges } from "#enums/challenges";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

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
      .ability(AbilityId.ANTICIPATION)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  it("should activate when the opponent has a super-effective move", async () => {
    game.override.enemyMoveset(MoveId.ABSORB);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied[0]).toBe(AbilityId.ANTICIPATION);
  });

  it("should activate when the opponent has a 1HKO move", async () => {
    game.override.enemyMoveset(MoveId.FISSURE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied[0]).toBe(AbilityId.ANTICIPATION);
  });

  it("should not activate when the opponent does not have a super-effective or 1HKO move", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied.length).toBe(0);
  });

  it("should not activate against status moves", async () => {
    game.override.enemyMoveset(MoveId.THUNDER_WAVE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied.length).toBe(0);
  });

  it("should work correctly in Inverse Battles", async () => {
    game.override.enemyMoveset(MoveId.EMBER);
    game.challengeMode.addChallenge(Challenges.INVERSE_BATTLE, 1, 1);
    await game.challengeMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.battleData.abilitiesApplied[0]).toBe(AbilityId.ANTICIPATION);
  });

  it("should ignore Gravity when evaluating move effectiveness", async () => {
    game.override.enemyMoveset(MoveId.EARTHQUAKE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.SKARMORY]);

    const playerPokemon = game.scene.getPlayerParty()[1];
    vi.spyOn(playerPokemon, "getMoveEffectiveness");

    game.move.use(MoveId.GRAVITY);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();

    // Should not have activated Anticipation despite taking super-effective damage
    expect(playerPokemon.getMoveEffectiveness).toHaveLastReturnedWith(2);
    expect(playerPokemon.battleData.abilitiesApplied.length).toBe(0);
  });

  it("should consider Hidden Power's calculated type, not its default Normal type", async () => {
    game.override.enemyMoveset(MoveId.HIDDEN_POWER).enemyIVs([31, 31, 31, 30, 31, 31]);
    // Hidden Power type set to Electric here
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(enemyPokemon.getMoveType(enemyPokemon.getMoveset()[0].getMove())).toBe(ElementalType.ELECTRIC);
    expect(playerPokemon.battleData.abilitiesApplied[0]).toBe(AbilityId.ANTICIPATION);
  });

  it("should not consider most variable-type moves' calculated type", async () => {
    game.override.enemySpecies(SpeciesId.PIKACHU).enemyMoveset(MoveId.REVELATION_DANCE);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(enemyPokemon.getMoveType(enemyPokemon.getMoveset()[0].getMove())).toBe(ElementalType.ELECTRIC);
    expect(playerPokemon.battleData.abilitiesApplied.length).toBe(0);
  });
});
