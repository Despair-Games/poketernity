import { allMoves } from "#data/data-lists";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Retaliate", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const retaliate = allMoves.get(MoveId.RETALIATE);

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
      .enemyMoveset([MoveId.RETALIATE, MoveId.RETALIATE, MoveId.RETALIATE, MoveId.RETALIATE])
      .enemyLevel(100)
      .moveset([MoveId.RETALIATE, MoveId.SPLASH])
      .startingLevel(80)
      .disableCrits();
  });

  it("increases power if ally died previous turn", async () => {
    vi.spyOn(retaliate, "calculateBattlePower");
    await game.classicMode.startBattle(SpeciesId.ABRA, SpeciesId.COBALION);
    game.move.select(MoveId.RETALIATE);
    await game.toEndOfTurn();
    expect(retaliate.calculateBattlePower).toHaveLastReturnedWith(70);
    game.selectPartyPokemon(1);

    await game.toNextTurn();
    game.move.select(MoveId.RETALIATE);
    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(retaliate.calculateBattlePower).toHaveReturnedWith(140);
  });
});
