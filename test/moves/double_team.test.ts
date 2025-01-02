import { Stat } from "#enums/stat";
import { Abilities } from "#enums/abilities";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
    game.overridesHelper.battleType("single");
    game.overridesHelper.moveset([Moves.DOUBLE_TEAM]);
    game.overridesHelper.disableCrits();
    game.overridesHelper.ability(Abilities.BALL_FETCH);
    game.overridesHelper.enemySpecies(Species.SHUCKLE);
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);
    game.overridesHelper.enemyMoveset([Moves.TACKLE, Moves.TACKLE, Moves.TACKLE, Moves.TACKLE]);
  });

  it("raises the user's EVA stat stage by 1", async () => {
    await game.startBattle([Species.MAGIKARP]);

    const ally = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    vi.spyOn(enemy, "getAccuracyMultiplier");
    expect(ally.getStatStage(Stat.EVA)).toBe(0);

    game.moveHelper.select(Moves.DOUBLE_TEAM);
    await game.phaseInterceptor.to(TurnEndPhase);
    await game.toNextTurn();

    expect(ally.getStatStage(Stat.EVA)).toBe(1);
    expect(enemy.getAccuracyMultiplier).toHaveReturnedWith(0.75);
  });
});
