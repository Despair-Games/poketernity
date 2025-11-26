import { AbilityId } from "#enums/ability-id";
import { ExpGainSpeed } from "#enums/exp-gain-speed";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// biome-ignore lint/correctness/noEmptyPattern: TODO: change this?
vi.mock("../data/exp", ({}) => {
  return {
    getLevelRelExp: vi.fn(() => 1), //consistent levelRelExp
  };
});

// TODO: figure out how to test this now
describe.todo("UI - Battle Info", () => {
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
    game.override.disableExpGain = false;
    game.override
      .moveset([MoveId.GUILLOTINE, MoveId.SPLASH])
      .battleType("single")
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(SpeciesId.CATERPIE);
  });

  it.each([
    ExpGainSpeed.FAST,
    ExpGainSpeed.FASTER,
    ExpGainSpeed.SKIP,
  ])("should increase exp gains animation by 2^%i", async (expGainSpeed) => {
    game.settings.expGainSpeed(expGainSpeed);
    vi.spyOn(Math, "pow");

    await game.classicMode.startBattle(SpeciesId.CHARIZARD);

    game.move.select(MoveId.SPLASH);
    await game.faintOpponents();
    await game.phaseInterceptor.to("ExpPhase", true);

    expect(Math.pow).not.toHaveBeenCalledWith(2, expGainSpeed);
  });
});
