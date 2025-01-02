import { BattlerIndex } from "#app/battle";
import { allMoves } from "#app/data/all-moves";
import { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Dynamax Cannon", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const dynamaxCannon = allMoves[Moves.DYNAMAX_CANNON];

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

    game.overridesHelper.moveset([dynamaxCannon.id]);
    game.overridesHelper.startingLevel(200);

    // Note that, for Waves 1-10, the level cap is 10
    game.overridesHelper.startingWave(1);
    game.overridesHelper.battleType("single");
    game.overridesHelper.disableCrits();

    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.enemyMoveset([Moves.SPLASH, Moves.SPLASH, Moves.SPLASH, Moves.SPLASH]);

    vi.spyOn(dynamaxCannon, "calculateBattlePower");
  });

  it("should return 100 power against an enemy below level cap", async () => {
    game.overridesHelper.enemyLevel(1);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    expect((game.scene.getCurrentPhase() as MoveEffectPhase).move.moveId).toBe(dynamaxCannon.id);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(100);
  }, 20000);

  it("should return 100 power against an enemy at level cap", async () => {
    game.overridesHelper.enemyLevel(10);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    expect((game.scene.getCurrentPhase() as MoveEffectPhase).move.moveId).toBe(dynamaxCannon.id);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(100);
  }, 20000);

  it("should return 120 power against an enemy 1% above level cap", async () => {
    game.overridesHelper.enemyLevel(101);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    expect(phase.move.moveId).toBe(dynamaxCannon.id);
    // Force level cap to be 100
    vi.spyOn(game.scene, "getMaxExpLevel").mockReturnValue(100);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(120);
  }, 20000);

  it("should return 140 power against an enemy 2% above level capp", async () => {
    game.overridesHelper.enemyLevel(102);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    expect(phase.move.moveId).toBe(dynamaxCannon.id);
    // Force level cap to be 100
    vi.spyOn(game.scene, "getMaxExpLevel").mockReturnValue(100);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(140);
  }, 20000);

  it("should return 160 power against an enemy 3% above level cap", async () => {
    game.overridesHelper.enemyLevel(103);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    expect(phase.move.moveId).toBe(dynamaxCannon.id);
    // Force level cap to be 100
    vi.spyOn(game.scene, "getMaxExpLevel").mockReturnValue(100);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(160);
  }, 20000);

  it("should return 180 power against an enemy 4% above level cap", async () => {
    game.overridesHelper.enemyLevel(104);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    expect(phase.move.moveId).toBe(dynamaxCannon.id);
    // Force level cap to be 100
    vi.spyOn(game.scene, "getMaxExpLevel").mockReturnValue(100);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(180);
  }, 20000);

  it("should return 200 power against an enemy 5% above level cap", async () => {
    game.overridesHelper.enemyLevel(105);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    expect(phase.move.moveId).toBe(dynamaxCannon.id);
    // Force level cap to be 100
    vi.spyOn(game.scene, "getMaxExpLevel").mockReturnValue(100);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(200);
  }, 20000);

  it("should return 200 power against an enemy way above level cap", async () => {
    game.overridesHelper.enemyLevel(999);
    await game.startBattle([Species.ETERNATUS]);

    game.moveHelper.select(dynamaxCannon.id);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    expect((game.scene.getCurrentPhase() as MoveEffectPhase).move.moveId).toBe(dynamaxCannon.id);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(200);
  }, 20000);
});
