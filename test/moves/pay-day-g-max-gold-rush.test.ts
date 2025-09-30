import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe.each([
  { moveName: "Pay Day", moveId: MoveId.PAY_DAY },
  { moveName: "G-Max Gold Rush", moveId: MoveId.G_MAX_GOLD_RUSH },
])("Moves - $moveName", ({ moveId }) => {
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
      .ability(AbilityId.BALL_FETCH)
      .moveset(moveId)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(1);
  });

  it("should award money on KO victory", async () => {
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    vi.spyOn(game.scene, "addMoney");

    game.move.select(moveId);
    await game.move.forceHit();
    await game.phaseInterceptor.to("SelectModifierPhase", false);

    expect(game.scene.money).toBeGreaterThan(0);
  });

  it("should award money on successful capture", async () => {
    game.override.enemyAbility(AbilityId.STURDY);
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    game.move.select(moveId);
    await game.move.forceHit();
    await game.toNextTurn();
    await game.throwPokeball(PokeballType.MASTER_BALL);
    await game.phaseInterceptor.to("SelectModifierPhase", false);

    expect(game.scene.money).toBeGreaterThan(0);
  });

  it("should NOT award money when player runs away", async () => {
    game.override.enemyLevel(999).enemyAbility(AbilityId.STURDY).ability(AbilityId.RUN_AWAY);
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    game.move.select(moveId);
    await game.move.forceHit();
    await game.toNextTurn();
    await game.tryToRunAway();
    await game.toNextTurn();

    expect(game.scene.money).toBe(0);
    expect(game.scene.currentBattle.waveIndex).toBe(2);
  });

  it("should NOT award money when forcing foe to flee", async () => {
    game.override.enemyLevel(100).enemyAbility(AbilityId.STURDY).ability(AbilityId.RUN_AWAY);
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    vi.spyOn(game.scene, "addMoney");

    game.move.select(moveId);
    await game.move.forceHit();
    await game.toNextTurn();
    game.move.use(MoveId.ROAR);
    await game.phaseInterceptor.to("NewBattlePhase", false);

    expect(game.scene.addMoney).not.toHaveBeenCalled();
  });

  it("should NOT award money when foe flees", async () => {
    game.override.enemyMoveset(MoveId.TELEPORT).enemyLevel(999).enemyAbility(AbilityId.STURDY);
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    vi.spyOn(game.scene, "addMoney");

    game.move.select(moveId);
    await game.move.forceHit();
    await game.phaseInterceptor.to("NewBattlePhase", false);

    expect(game.scene.addMoney).not.toHaveBeenCalled();
  });
});
