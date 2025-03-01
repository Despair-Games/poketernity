import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phase from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe.todo("Items - Leek", () => {
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
      .enemyMoveset([MoveId.SPLASH, MoveId.SPLASH, MoveId.SPLASH, MoveId.SPLASH])
      .moveset([MoveId.TACKLE])
      .battleType("single");
  });

  it("should raise CRIT stage by 2 when held by FARFETCHD", async () => {
    await game.startBattle([Species.FARFETCHD]);

    const enemyMember = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemyMember, "getCritStage");

    game.move.select(MoveId.TACKLE);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyMember.getCritStage).toHaveReturnedWith(2);
  }, 20000);

  it("should raise CRIT stage by 2 when held by GALAR_FARFETCHD", async () => {
    await game.startBattle([Species.GALAR_FARFETCHD]);

    const enemyMember = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemyMember, "getCritStage");

    game.move.select(MoveId.TACKLE);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyMember.getCritStage).toHaveReturnedWith(2);
  }, 20000);

  it("should raise CRIT stage by 2 when held by SIRFETCHD", async () => {
    await game.startBattle([Species.SIRFETCHD]);

    const enemyMember = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemyMember, "getCritStage");

    game.move.select(MoveId.TACKLE);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyMember.getCritStage).toHaveReturnedWith(2);
  }, 20000);

  it("should not raise CRIT stage when held by a Pokemon outside of FARFETCHD line", async () => {
    await game.startBattle([Species.PIKACHU]);

    const enemyMember = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemyMember, "getCritStage");

    game.move.select(MoveId.TACKLE);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(enemyMember.getCritStage).toHaveReturnedWith(0);
  }, 20000);
});
