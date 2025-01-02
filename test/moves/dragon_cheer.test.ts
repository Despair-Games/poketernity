import { BattlerIndex } from "#app/battle";
import { Type } from "#enums/type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Abilities } from "#enums/abilities";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Dragon Cheer", () => {
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
    game.overridesHelper
      .battleType("double")
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .enemyLevel(20)
      .moveset([Moves.DRAGON_CHEER, Moves.TACKLE, Moves.SPLASH]);
  });

  it("increases the user's allies' critical hit ratio by one stage", async () => {
    await game.classicModeHelper.startBattle([Species.DRAGONAIR, Species.MAGIKARP]);

    const enemy = game.scene.getEnemyField()[0];

    vi.spyOn(enemy, "getCritStage");

    game.moveHelper.select(Moves.DRAGON_CHEER, 0);
    game.moveHelper.select(Moves.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // After Tackle
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(enemy.getCritStage).toHaveReturnedWith(1); // getCritStage is called on defender
  });

  it("increases the user's Dragon-type allies' critical hit ratio by two stages", async () => {
    await game.classicModeHelper.startBattle([Species.MAGIKARP, Species.DRAGONAIR]);

    const enemy = game.scene.getEnemyField()[0];

    vi.spyOn(enemy, "getCritStage");

    game.moveHelper.select(Moves.DRAGON_CHEER, 0);
    game.moveHelper.select(Moves.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // After Tackle
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(enemy.getCritStage).toHaveReturnedWith(2); // getCritStage is called on defender
  });

  it("applies the effect based on the allies' type upon use of the move, and do not change if the allies' type changes later in battle", async () => {
    await game.classicModeHelper.startBattle([Species.DRAGONAIR, Species.MAGIKARP]);

    const magikarp = game.scene.getPlayerField()[1];
    const enemy = game.scene.getEnemyField()[0];

    vi.spyOn(enemy, "getCritStage");

    game.moveHelper.select(Moves.DRAGON_CHEER, 0);
    game.moveHelper.select(Moves.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // After Tackle
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(enemy.getCritStage).toHaveReturnedWith(1); // getCritStage is called on defender

    await game.toNextTurn();

    // Change Magikarp's type to Dragon
    vi.spyOn(magikarp, "getTypes").mockReturnValue([Type.DRAGON]);
    expect(magikarp.getTypes()).toEqual([Type.DRAGON]);

    game.moveHelper.select(Moves.SPLASH, 0);
    game.moveHelper.select(Moves.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getCritStage).toHaveReturnedWith(1); // getCritStage is called on defender
  });
});
