import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";
import { allMoves } from "#app/data/data-lists";

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
      .moveset([MoveId.SHEER_COLD, MoveId.GUILLOTINE])
      .enemySpecies(Species.CHARIZARD)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("OHKO moves should OHKO when they hit", async () => {
    game.override.ability(Abilities.NO_GUARD);
    await game.classicMode.startBattle([Species.MACHAMP]);

    game.move.select(MoveId.GUILLOTINE);
    await game.phaseInterceptor.to("FaintPhase");
  });

  it("OHKO moves accuracy goes up by 1% for each level the user is above the target", async () => {
    game.override.startingLevel(170).enemySpecies(Species.ARCEUS);
    await game.classicMode.startBattle([Species.MACHAMP]);
    const moveToCheck = allMoves[MoveId.GUILLOTINE];

    vi.spyOn(moveToCheck, "calculateBattleAccuracy");

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(moveToCheck.calculateBattleAccuracy).toHaveReturnedWith(100);
  });

  it("OHKO moves should always fail if the opponent is higher level", async () => {
    game.override.ability(Abilities.NO_GUARD).enemyLevel(101);
    await game.classicMode.startBattle([Species.MACHAMP]);
    const enemy = game.scene.getEnemyParty()[0];

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemy.hp).toBe(enemy.getMaxHp());
  });

  it("OHKO moves should always fail if blocked by sturdy", async () => {
    game.override.ability(Abilities.NO_GUARD).enemyAbility(Abilities.STURDY);
    await game.classicMode.startBattle([Species.MACHAMP]);
    const enemy = game.scene.getEnemyParty()[0];

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemy.hp).toBe(enemy.getMaxHp());
  });

  it("OHKO moves should fail on G-Max Pokemon", async () => {
    game.override
      .ability(Abilities.NO_GUARD)
      .enemySpecies(Species.LAPRAS)
      .enemyForms({ [Species.LAPRAS]: 1 });
    await game.classicMode.startBattle([Species.MACHAMP]);
    const enemy = game.scene.getEnemyParty()[0];
    expect(enemy.isMax()).toBe(true);

    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemy.hp).toBe(enemy.getMaxHp());
  });

  it("OHKO moves should do 1 HP bar for boss Pokemon", async () => {
    game.override.enemySpecies(Species.ARCEUS).ability(Abilities.NO_GUARD);
    await game.classicMode.startBattle([Species.MACHAMP]);
    const enemy = game.scene.getEnemyParty()[0];
    expect(enemy.getBossSegments()).toBe(4);

    expect(enemy.hp).toBe(enemy.getMaxHp());
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemy.hp - (enemy.getMaxHp() * 3) / 4).toBeLessThan(3);
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemy.hp - (enemy.getMaxHp() * 2) / 4).toBeLessThan(3);
    game.move.select(MoveId.GUILLOTINE);
    await game.toNextTurn();
    expect(enemy.hp - (enemy.getMaxHp() * 1) / 4).toBeLessThan(3);
    game.move.select(MoveId.GUILLOTINE);
    await game.phaseInterceptor.to("FaintPhase");
  });
});
