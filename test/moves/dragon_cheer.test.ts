import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
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
    game.override
      .battleType("double")
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(20)
      .moveset([MoveId.DRAGON_CHEER, MoveId.TACKLE, MoveId.SPLASH]);
  });

  it("increases the user's allies' critical hit ratio by one stage", async () => {
    await game.classicMode.startBattle([Species.DRAGONAIR, Species.MAGIKARP]);

    const enemy = game.scene.getEnemyField()[0];

    vi.spyOn(enemy, "getCritStage");

    game.move.select(MoveId.DRAGON_CHEER, 0);
    game.move.select(MoveId.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // After Tackle
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(1); // getCritStage is called on defender
  });

  it("increases the user's Dragon-type allies' critical hit ratio by two stages", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP, Species.DRAGONAIR]);

    const enemy = game.scene.getEnemyField()[0];

    vi.spyOn(enemy, "getCritStage");

    game.move.select(MoveId.DRAGON_CHEER, 0);
    game.move.select(MoveId.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // After Tackle
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(2); // getCritStage is called on defender
  });

  it("applies the effect based on the allies' type upon use of the move, and do not change if the allies' type changes later in battle", async () => {
    await game.classicMode.startBattle([Species.DRAGONAIR, Species.MAGIKARP]);

    const magikarp = game.scene.getPlayerField()[1];
    const enemy = game.scene.getEnemyField()[0];

    vi.spyOn(enemy, "getCritStage");

    game.move.select(MoveId.DRAGON_CHEER, 0);
    game.move.select(MoveId.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // After Tackle
    await game.toEndOfTurn();
    expect(enemy.getCritStage).toHaveReturnedWith(1); // getCritStage is called on defender

    await game.toNextTurn();

    // Change Magikarp's type to Dragon
    vi.spyOn(magikarp, "getTypes").mockReturnValue([ElementalType.DRAGON]);
    expect(magikarp.getTypes()).toEqual([ElementalType.DRAGON]);

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.TACKLE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getCritStage).toHaveReturnedWith(1); // getCritStage is called on defender
  });
});
