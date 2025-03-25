import { Stat } from "#enums/stat";
import { AbilityId } from "#enums/ability-id";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Double Team", () => {
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
    game.override.battleType("single");
    game.override.moveset([MoveId.DOUBLE_TEAM]);
    game.override.disableCrits();
    game.override.ability(AbilityId.BALL_FETCH);
    game.override.enemySpecies(SpeciesId.SHUCKLE);
    game.override.enemyAbility(AbilityId.BALL_FETCH);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
  });

  it("raises the user's EVA stat stage by 1", async () => {
    await game.startBattle([SpeciesId.MAGIKARP]);

    const ally = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemy, "getAccuracyMultiplier");
    expect(ally.getStatStage(Stat.EVA)).toBe(0);

    game.move.select(MoveId.DOUBLE_TEAM);
    await game.phaseInterceptor.to(TurnEndPhase);
    await game.toNextTurn();

    expect(ally.getStatStage(Stat.EVA)).toBe(1);
    expect(enemy.getAccuracyMultiplier).toHaveReturnedWith(0.75);
  });
});
