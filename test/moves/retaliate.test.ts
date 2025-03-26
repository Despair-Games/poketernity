import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Phaser from "phaser";
import { GameManager } from "#test/test-utils/gameManager";
import { SpeciesId } from "#enums/species-id";
import { MoveId } from "#enums/move-id";
import { allMoves } from "#app/data/data-lists";

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
    await game.startBattle([SpeciesId.ABRA, SpeciesId.COBALION]);
    game.move.select(MoveId.RETALIATE);
    await game.toEndOfTurn();
    expect(retaliate.calculateBattlePower).toHaveLastReturnedWith(70);
    game.doSelectPartyPokemon(1);

    await game.toNextTurn();
    game.move.select(MoveId.RETALIATE);
    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(retaliate.calculateBattlePower).toHaveReturnedWith(140);
  });
});
