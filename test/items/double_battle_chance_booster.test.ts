import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { DoubleBattleChanceBoosterModifier } from "#app/modifier/modifier";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ShopCursorTarget } from "#enums/shop-cursor-target";
import { Mode } from "#app/ui/ui";
import type ModifierSelectUiHandler from "#app/ui/modifier-select-ui-handler";
import { Button } from "#enums/buttons";

describe("Items - Double Battle Chance Boosters", () => {
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
  });

  it("should guarantee double battle with 2 unique tiers", async () => {
    game.overridesHelper.startingModifier([{ name: "LURE" }, { name: "SUPER_LURE" }]).startingWave(2);

    await game.classicModeHelper.startBattle();

    expect(game.scene.getEnemyField().length).toBe(2);
  });

  it("should guarantee double boss battle with 3 unique tiers", async () => {
    game.overridesHelper
      .startingModifier([{ name: "LURE" }, { name: "SUPER_LURE" }, { name: "MAX_LURE" }])
      .startingWave(10);

    await game.classicModeHelper.startBattle();

    const enemyField = game.scene.getEnemyField();

    expect(enemyField.length).toBe(2);
    expect(enemyField[0].isBoss()).toBe(true);
    expect(enemyField[1].isBoss()).toBe(true);
  });

  it("should renew how many battles are left of existing booster when picking up new booster of same tier", async () => {
    game.overridesHelper
      .startingModifier([{ name: "LURE" }])
      .itemRewards([{ name: "LURE" }])
      .moveset(Moves.SPLASH)
      .startingLevel(200);

    await game.classicModeHelper.startBattle([Species.PIKACHU]);

    game.moveHelper.select(Moves.SPLASH);

    await game.doKillOpponents();

    await game.phaseInterceptor.to("BattleEndPhase");

    const modifier = game.scene.findModifier(
      (m) => m instanceof DoubleBattleChanceBoosterModifier,
    ) as DoubleBattleChanceBoosterModifier;
    expect(modifier.getBattleCount()).toBe(9);

    // Forced LURE to spawn in the first slot with override
    game.onNextPrompt(
      "SelectModifierPhase",
      Mode.MODIFIER_SELECT,
      () => {
        const handler = game.scene.ui.getHandler() as ModifierSelectUiHandler;
        // Traverse to first modifier slot
        handler.setCursor(0);
        handler.setRowCursor(ShopCursorTarget.REWARDS);
        handler.processInput(Button.ACTION);
      },
      () => game.isCurrentPhase("CommandPhase") || game.isCurrentPhase("NewBattlePhase"),
      true,
    );

    await game.phaseInterceptor.to("TurnInitPhase");

    // Making sure only one booster is in the modifier list even after picking up another
    let count = 0;
    for (const m of game.scene.modifiers) {
      if (m instanceof DoubleBattleChanceBoosterModifier) {
        count++;
        const modifierInstance = m as DoubleBattleChanceBoosterModifier;
        expect(modifierInstance.getBattleCount()).toBe(modifierInstance.getMaxBattles());
      }
    }
    expect(count).toBe(1);
  });
});
