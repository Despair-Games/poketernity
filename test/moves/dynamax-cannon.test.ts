import { allMoves } from "#app/data/data-lists";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";

describe("Moves - Dynamax Cannon", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const dynamaxCannon = allMoves.get(MoveId.DYNAMAX_CANNON);

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
      .enemySpecies(SpeciesId.SNORLAX)
      .enemyForms({ [SpeciesId.SNORLAX]: 1 })
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100)
      .disableCrits()
      .moveset([MoveId.DYNAMAX_CANNON, MoveId.EARTHQUAKE]);
  });

  it("should deal double damage against a dynamax'd Pokemon", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat").mockReturnValue(80);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat").mockReturnValue(90);

    game.move.select(MoveId.EARTHQUAKE);
    await game.toNextTurn();

    // expected base damage = [(2*level/5 + 2) * power * playerATK / enemyDEF / 50] + 2
    //                      = 76.666...
    // Dynamax damage reduction of 1/3 -> 51.11
    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(50);

    // Heal the opponent back to full
    enemyPokemon.hp = enemyPokemon.getMaxHp();
    game.move.select(MoveId.DYNAMAX_CANNON);
    await game.toNextTurn();

    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(102);
  });

  it("should not deal double damage against non max Pokemon", async () => {
    game.override.enemySpecies(SpeciesId.SNORLAX).enemyForms({ [SpeciesId.SNORLAX]: 0 });
    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat").mockReturnValue(80);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat").mockReturnValue(90);

    game.move.select(MoveId.EARTHQUAKE);
    await game.toNextTurn();

    // expected base damage = [(2*level/5 + 2) * power * playerATK / enemyDEF / 50] + 2
    //                      = 76.666...
    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(76);

    // Heal the opponent back to full
    enemyPokemon.hp = enemyPokemon.getMaxHp();
    game.move.select(MoveId.DYNAMAX_CANNON);
    await game.toNextTurn();

    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(76);
  });

  it("should not deal double damage against Eternamax", async () => {
    game.override.enemySpecies(SpeciesId.ETERNATUS).enemyForms({ [SpeciesId.ETERNATUS]: 1 });
    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat").mockReturnValue(80);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat").mockReturnValue(90);

    game.move.select(MoveId.EARTHQUAKE);
    await game.toNextTurn();

    // expected base damage = [(2*level/5 + 2) * power * playerATK / enemyDEF / 50] + 2
    //                      = 76.666...
    // Super effective *2
    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(153);

    // Heal the opponent back to full
    enemyPokemon.hp = enemyPokemon.getMaxHp();
    game.move.select(MoveId.DYNAMAX_CANNON);
    await game.toNextTurn();

    expect(enemyPokemon.getMaxHp() - enemyPokemon.hp).toBeCloseTo(153);
  });

  it("Dynamax cannon cannot be encored", async () => {
    game.override.enemySpecies(SpeciesId.SHUCKLE).enemyAbility(AbilityId.STURDY).enemyMoveset(MoveId.ENCORE);
    await game.classicMode.startBattle([SpeciesId.ETERNATUS]);

    game.move.select(dynamaxCannon.id);
    await game.toNextTurn();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.getTag(BattlerTagType.ENCORE)).toBeUndefined();
  });
});
