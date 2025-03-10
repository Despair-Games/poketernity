import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";
import { allMoves } from "#app/data/data-lists";
import { Stat } from "#enums/stat";

describe("Moves - One Hit KO Moves", () => {
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
      .startingLevel(100)
      .moveset([MoveId.SHEER_COLD, MoveId.GUILLOTINE, MoveId.SPLASH])
      .enemySpecies(Species.CHARIZARD)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("OHKO moves should OHKO when they hit", async () => {
    game.override.ability(Abilities.NO_GUARD);
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.select(MoveId.GUILLOTINE);
    await game.toEndOfTurn();

    expect(enemyPokemon.isFainted()).toBe(true);
  });

  it("ignores damage modification from abilities, for example FUR_COAT", async () => {
    game.override.ability(Abilities.NO_GUARD);
    game.override.enemyAbility(Abilities.FUR_COAT);
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.select(MoveId.GUILLOTINE);
    await game.toEndOfTurn();

    expect(enemyPokemon.isFainted()).toBe(true);
  });

  it("ignores user's ACC stat stage", async () => {
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const partyPokemon = game.field.getPlayerPokemon();
    vi.spyOn(partyPokemon, "getAccuracyMultiplier");

    partyPokemon.setStatStage(Stat.ACC, -6);

    game.move.select(MoveId.GUILLOTINE);

    // wait for TurnEndPhase instead of DamagePhase as guillotine might not actually inflict damage
    await game.toEndOfTurn();

    expect(partyPokemon.getAccuracyMultiplier).toHaveReturnedWith(1);
  });

  it("ignores target's EVA stat stage", async () => {
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const partyPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(partyPokemon, "getAccuracyMultiplier");

    enemyPokemon.setStatStage(Stat.EVA, 6);

    game.move.select(MoveId.GUILLOTINE);

    // wait for TurnEndPhase instead of DamagePhase as guillotine might not actually inflict damage
    await game.toEndOfTurn();

    expect(partyPokemon.getAccuracyMultiplier).toHaveReturnedWith(1);
  });

  it("OHKO moves accuracy goes up by 1% for each level the user is above the target", async () => {
    game.override.startingLevel(142).enemySpecies(Species.ARCEUS).ability(Abilities.BALL_FETCH);
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const moveToCheck = allMoves.get(MoveId.GUILLOTINE);

    vi.spyOn(moveToCheck, "calculateBattleAccuracy");

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(moveToCheck.calculateBattleAccuracy).toHaveReturnedWith(30 + 42);
  });

  it("OHKO moves should always fail if the opponent is higher level", async () => {
    game.override.ability(Abilities.NO_GUARD).enemyLevel(101);
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });

  it("OHKO moves should always fail if blocked by sturdy", async () => {
    game.override.ability(Abilities.NO_GUARD).enemyAbility(Abilities.STURDY);
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });

  it("OHKO moves should fail on G-Max Pokemon", async () => {
    game.override
      .ability(Abilities.NO_GUARD)
      .enemySpecies(Species.LAPRAS)
      .enemyForms({ [Species.LAPRAS]: 1 });
    await game.classicMode.startBattle([Species.ALAKAZAM]);
    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.isMax()).toBe(true);

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });

  it("OHKO moves should do 1 HP bar for boss Pokemon", async () => {
    game.override.enemySpecies(Species.ARCEUS).ability(Abilities.NO_GUARD);
    await game.classicMode.startBattle([Species.MACHAMP]);
    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getBossSegments()).toBe(4);

    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp - (enemyPokemon.getMaxHp() * 3) / 4).toBeLessThan(3);
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp - (enemyPokemon.getMaxHp() * 2) / 4).toBeLessThan(3);
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp - (enemyPokemon.getMaxHp() * 1) / 4).toBeLessThan(3);
    game.move.select(MoveId.GUILLOTINE);
    await game.toEndOfTurn();
    expect(enemyPokemon.isFainted()).toBe(true);
  });

  it("OHKO moves should go to the next hp bar for boss Pokemon", async () => {
    game.override.enemySpecies(Species.ARCEUS).ability(Abilities.NO_GUARD);
    await game.classicMode.startBattle([Species.MACHAMP]);
    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getBossSegments()).toBe(4);

    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp - (enemyPokemon.getMaxHp() * 3) / 4).toBeLessThan(3);
    game.move.select(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.RECOVER);
    await game.toNextTurn();
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemyPokemon.hp - (enemyPokemon.getMaxHp() * 2) / 4).toBeLessThan(3);
  });
});
