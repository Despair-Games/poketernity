import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Battle Mechanics - Damage Calculation", () => {
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
      .battleType("single")
      .enemySpecies(Species.SNORLAX)
      .enemyForms({ [Species.SNORLAX]: 1 })
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100)
      .disableCrits()
      .moveset([MoveId.TACKLE, MoveId.DRAGON_RAGE, MoveId.HAIL]);
  });

  it("Tackle deals expected damage after gmax damage reduction", async () => {
    await game.classicMode.startBattle([Species.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat").mockReturnValue(80);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat").mockReturnValue(90);

    game.move.select(MoveId.TACKLE);
    await game.toNextTurn();

    // expected base damage = [(2*level/5 + 2) * power * playerATK / enemyDEF / 50] + 2
    //                      = 31.8666...
    // Dynamax damage reduction of 1/3 -> 21.24
    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(20);
  });

  it("E-Max Eternatus does not get gmax damage reduction", async () => {
    game.override.enemySpecies(Species.ETERNATUS).enemyForms({ [Species.ETERNATUS]: 1 });
    await game.classicMode.startBattle([Species.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat").mockReturnValue(80);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat").mockReturnValue(90);

    game.move.select(MoveId.TACKLE);
    await game.toNextTurn();

    // expected base damage = [(2*level/5 + 2) * power * playerATK / enemyDEF / 50] + 2
    //                      = 31.8666...
    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(31);
  });

  it("Attacks deal 1 damage at minimum", async () => {
    game.override.startingLevel(1).enemyLevel(100000);
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.TACKLE);
    await game.toNextTurn();

    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBe(1);
  });

  it("Fixed-damage moves still get damage reduction", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "isMax").mockReturnValue(true);

    game.move.select(MoveId.DRAGON_RAGE);
    await game.toNextTurn();

    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(26);
  });

  it("Percent based damage moves still get damage reduction", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    game.move.select(MoveId.HAIL);
    await game.toNextTurn();

    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeLessThanOrEqual(
      (((1 / 16) * 2) / 3) * enemyPokemon.getMaxHp(),
    );
  });

  it("Perish Song should still KO G-Max Pokemon", async () => {
    game.override.moveset([MoveId.PERISH_SONG, MoveId.SPLASH]);
    await game.classicMode.startBattle([Species.MAGIKARP, Species.MAGIKARP]);

    game.move.select(MoveId.PERISH_SONG);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("VictoryPhase");

    expect(game.scene.getPlayerParty()[0].isFainted()).toBe(true);
    expect(game.scene.getEnemyParty()[0].isFainted()).toBe(true);
  });
});
