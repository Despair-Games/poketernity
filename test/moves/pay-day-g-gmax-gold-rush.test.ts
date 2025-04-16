import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
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
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it(`should award money on victory`, async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    vi.spyOn(game.scene, "addMoney");

    game.move.select(moveId);
    await game.move.forceHit();
    await game.toNextTurn();
    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    // await game.toEndOfTurn();
    await game.phaseInterceptor.to(SelectModifierPhase, false);

    expect(game.scene.addMoney).toHaveBeenCalled();
  });

  it(`should NOT award money on forcing foe to flee`, async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    vi.spyOn(game.scene, "addMoney");

    game.move.select(moveId);
    await game.move.forceHit();
    await game.toNextTurn();
    game.move.use(MoveId.ROAR);
    await game.phaseInterceptor.to(NewBattlePhase, false);

    expect(game.scene.addMoney).not.toHaveBeenCalled();
  });

  it(`should NOT award money on foe fleeing`, async () => {
    game.override.enemyMoveset(MoveId.TELEPORT);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    vi.spyOn(game.scene, "addMoney");

    game.move.select(moveId);
    await game.move.forceHit();
    await game.phaseInterceptor.to(NewBattlePhase, false);

    expect(game.scene.addMoney).not.toHaveBeenCalled();
  });
});
