import { allMoves } from "#app/data/all-moves";
import { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";

describe("Moves - Dynamax Cannon", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const dynamaxCannon = allMoves[MoveId.DYNAMAX_CANNON];

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

    game.override.moveset([dynamaxCannon.id]);
    game.override.startingLevel(200);

    game.override.battleType("single");
    game.override.disableCrits();

    game.override.enemySpecies(Species.MAGIKARP);
    game.override.enemyMoveset([MoveId.SPLASH]);

    vi.spyOn(dynamaxCannon, "calculateBattlePower");
  });

  it("should return 100 power against a non dynamax'd Pokemon", async () => {
    await game.classicMode.startBattle([Species.ETERNATUS]);

    game.move.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    expect((game.scene.getCurrentPhase() as MoveEffectPhase).move.moveId).toBe(dynamaxCannon.id);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(100);
  });

  it("should return 200 power against a G-Max Pokemon", async () => {
    game.override.enemySpecies(Species.SNORLAX).enemyForms({ [Species.SNORLAX]: 1 });
    await game.classicMode.startBattle([Species.ETERNATUS]);

    game.move.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    expect((game.scene.getCurrentPhase() as MoveEffectPhase).move.moveId).toBe(dynamaxCannon.id);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(200);
  });

  it("should return 100 power against E-Max Eternatus", async () => {
    game.override.enemySpecies(Species.ETERNATUS).enemyForms({ [Species.ETERNATUS]: 1 });
    await game.classicMode.startBattle([Species.ETERNATUS]);

    game.move.select(dynamaxCannon.id);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    expect(phase.move.moveId).toBe(dynamaxCannon.id);

    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(dynamaxCannon.calculateBattlePower).toHaveLastReturnedWith(100);
  });

  it("Dynamax cannon cannot be encored", async () => {
    game.override.enemySpecies(Species.SHUCKLE).enemyAbility(Abilities.STURDY).enemyMoveset(MoveId.ENCORE);
    await game.classicMode.startBattle([Species.ETERNATUS]);

    game.move.select(dynamaxCannon.id);
    await game.toNextTurn();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.getTag(BattlerTagType.ENCORE)).toBeUndefined();
  });
});
