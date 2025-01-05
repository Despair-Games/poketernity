import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Rock Head", () => {
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
      .ability(Abilities.ROCK_HEAD)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should do not take recoil damage", async () => {
    game.override.moveset(Moves.TAKE_DOWN);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.TAKE_DOWN);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.isFullHp()).toBe(true);
  });

  it("should take recoil damage when using Struggle", async () => {
    game.override.moveset(Moves.STRUGGLE);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.STRUGGLE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.isFullHp()).toBe(false);
  });

  it.each([
    { abilityName: "Mummy", ability: Abilities.MUMMY },
    { abilityName: "Lingering Aroma", ability: Abilities.LINGERING_AROMA },
  ])(
    "should be overwritten by $abilityName if a contact move is used and thus, recoil damage will not be blocked",
    async ({ ability }) => {
      game.override.moveset(Moves.TAKE_DOWN).enemyAbility(ability);
      await game.classicMode.startBattle([Species.FEEBAS]);
      const pokemon = game.scene.getPlayerPokemon();

      game.move.select(Moves.TAKE_DOWN);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      expect(pokemon?.isFullHp()).toBe(false);
    },
  );

  it("should not prevent crash damage", async () => {
    game.override.moveset(Moves.HIGH_JUMP_KICK);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.HIGH_JUMP_KICK);
    await game.move.forceMiss();
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.isFullHp()).toBe(false);
  });

  it("should not prevent the user from fainting due to using a move", async () => {
    game.override.moveset(Moves.HEALING_WISH);
    await game.classicMode.startBattle([Species.FEEBAS, Species.ABRA]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.HEALING_WISH);
    await game.move.forceMiss();
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.isFullHp()).toBe(false);
  });

  it("should not prevent the user from fainting", async () => {
    game.override.moveset(Moves.HEALING_WISH);
    await game.classicMode.startBattle([Species.FEEBAS, Species.ABRA]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.HEALING_WISH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.isFullHp()).toBe(false);
  });

  it.each([
    { moveName: "Mind Blown", move: Moves.MIND_BLOWN },
    { moveName: "Steel Beam", move: Moves.STEEL_BEAM },
  ])("should not prevent the user from taking damage when using $moveName", async ({ move }) => {
    game.override.moveset(move);
    await game.classicMode.startBattle([Species.FEEBAS, Species.ABRA]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(move);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.isFullHp()).toBe(false);
  });
});
