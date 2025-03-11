import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phase from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe.todo("Items - Scope Lens", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phase.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.override
      .enemySpecies(Species.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH)
      .moveset([MoveId.POUND])
      .battleType("single");
  }, 20000);

  it("should raise CRIT stage by 1", async () => {
    await game.startBattle([Species.GASTLY]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemyPokemon, "getCritStage");

    game.move.select(MoveId.POUND);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyPokemon.getCritStage).toHaveReturnedWith(1);
  }, 20000);
});
