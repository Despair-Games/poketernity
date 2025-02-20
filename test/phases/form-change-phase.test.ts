import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ElementalType } from "#enums/elemental-type";
import { generateModifierType } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { modifierTypes } from "#app/modifier/modifier-types";
import { Button } from "#enums/buttons";
import { FormChangeItem } from "#enums/form-change-item";

describe("Form Change Phase", () => {
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingModifier([{ name: "DYNAMAX_BAND" }, { name: "MEGA_BRACELET" }]);
  });

  it("should not be cancellable", async () => {
    await game.classicMode.startBattle([Species.ZACIAN]);

    // Before the form change: Should be Hero form
    const zacian = game.scene.getPlayerParty()[0];
    expect(zacian.getFormKey()).toBe("hero-of-many-battles");
    expect(zacian.getTypes()).toStrictEqual([ElementalType.FAIRY]);
    expect(zacian.calculateBaseStats()).toStrictEqual([92, 120, 115, 80, 115, 138]);
    expect(zacian.moveset.map((m) => m.moveId)).not.toContain(MoveId.BEHEMOTH_BLADE);

    // Prevent form change from finishing instantly, so that the player can attempt to cancel it
    const originalDoCycle = game.scene.animations.doCycle;
    vi.spyOn(game.scene.animations, "doCycle").mockImplementation(async (...args) => {
      await new Promise<void>((resolve) => setTimeout(resolve));
      return originalDoCycle.apply(game.scene.animations, args);
    });

    // Give Zacian a Rusted Sword
    const rustedSwordType = generateModifierType(modifierTypes.RARE_FORM_CHANGE_ITEM)!;
    const rustedSword = rustedSwordType.newModifier(zacian);
    game.scene.addModifier(rustedSword);

    game.move.use(MoveId.SPLASH);
    await game.phaseInterceptor.to("FormChangePhase", false);

    // Repeatedly press "Cancel" to attempt to cancel form change
    const pressCancelInterval = setInterval(() => game.scene.ui.getHandler().processInput(Button.CANCEL));

    await game.toNextTurn();
    clearInterval(pressCancelInterval);

    // After the form change: Should be Crowned form
    expect(game.phaseInterceptor.log.includes("FormChangePhase")).toBe(true);
    expect(zacian.getFormKey()).toBe("crowned");
    expect(zacian.getTypes()).toStrictEqual([ElementalType.FAIRY, ElementalType.STEEL]);
    expect(zacian.calculateBaseStats()).toStrictEqual([92, 150, 115, 80, 115, 148]);
    expect(zacian.moveset.map((m) => m.moveId)).toContain(MoveId.BEHEMOTH_BLADE);
  });

  it("should allow a G-Max Pokemon to learn its respective G-Max move", async () => {
    await game.classicMode.startBattle([Species.RILLABOOM]);

    // Before the form change: Should be normal form
    const rillaboom = game.scene.getPlayerParty()[0];
    expect(rillaboom.getFormKey()).toBe("");
    expect(rillaboom.moveset.map((m) => m.moveId)).not.toContain(MoveId.G_MAX_DRUM_SOLO);

    // Give Rillaboom max mushrooms
    const maxMushroomsType = generateModifierType(modifierTypes.RARE_FORM_CHANGE_ITEM)!;
    const maxMushrooms = maxMushroomsType.newModifier(rillaboom);
    game.scene.addModifier(maxMushrooms);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    // After the form change: Should be G-Max form
    expect(game.phaseInterceptor.log.includes("FormChangePhase")).toBe(true);
    expect(rillaboom.getFormKey()).toBe("gigantamax");
    expect(rillaboom.moveset.map((m) => m.moveId)).toContain(MoveId.G_MAX_DRUM_SOLO);
    expect(game.phaseInterceptor.log.includes("LearnMovePhase")).toBe(true);
  });

  it("should not cause a Mega-evolving Pokemon to learn a move", async () => {
    await game.classicMode.startBattle([Species.BEEDRILL]);

    // Before the form change: Should be normal form
    const beedrill = game.scene.getPlayerParty()[0];
    expect(beedrill.getFormKey()).toBe("");

    // Give Beedrill a Mega Stone
    const megaStoneType = generateModifierType(modifierTypes.RARE_FORM_CHANGE_ITEM)!;
    const megaStone = megaStoneType.newModifier(beedrill);
    game.scene.addModifier(megaStone);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    // After the form change: Should be Mega form
    expect(game.phaseInterceptor.log.includes("FormChangePhase")).toBe(true);
    expect(beedrill.getFormKey()).toBe("mega");
    expect(beedrill.moveset.map((m) => m.moveId)).not.toContain(MoveId.TWINEEDLE);
    expect(game.phaseInterceptor.log.includes("LearnMovePhase")).toBe(false);
  });

  it("should not cause a Pokemon to learn moves when deactivating and reactivating Form Change Items", async () => {
    game.override
      .starterForms({ [Species.RILLABOOM]: 1 })
      .startingHeldItems([{ name: "FORM_CHANGE_ITEM", type: FormChangeItem.MAX_MUSHROOMS }]);
    await game.classicMode.startBattle([Species.RILLABOOM]);

    // Before the form change: Should be G-Max form
    const rillaboom = game.scene.getPlayerParty()[0];
    expect(rillaboom.getFormKey()).toBe("gigantamax");

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to("SelectModifierPhase");

    // Navigate UI: Access "Check Party" menu from modifier selection
    await new Promise<void>((r) => setTimeout(r, 10));
    game.scene.ui.processInput(Button.DOWN);
    game.scene.ui.processInput(Button.DOWN);
    game.scene.ui.processInput(Button.DOWN);
    game.scene.ui.processInput(Button.RIGHT);
    game.scene.ui.processInput(Button.RIGHT);
    game.scene.ui.processInput(Button.ACTION);

    // Navigate UI: Deactivate Max Mushrooms
    await new Promise<void>((r) => setTimeout(r, 10));
    game.scene.ui.processInput(Button.ACTION);
    game.scene.ui.processInput(Button.ACTION);
    await game.phaseInterceptor.run("FormChangePhase");
    expect(rillaboom.getFormKey()).toBe("");

    // Navigate UI: Reactivate Max Mushrooms
    game.scene.ui.processInput(Button.ACTION);
    game.scene.ui.processInput(Button.ACTION);
    await game.phaseInterceptor.run("FormChangePhase");
    expect(rillaboom.getFormKey()).toBe("gigantamax");

    // Navigate UI: Exit "Check Party" menu
    game.scene.ui.processInput(Button.CANCEL);
    await game.toNextWave();

    // Expect no new moves to be learned
    expect(rillaboom.moveset.map((m) => m.moveId)).not.toContain(MoveId.G_MAX_DRUM_SOLO);
    expect(rillaboom.moveset.map((m) => m.moveId)).not.toContain(MoveId.DRUM_BEATING);
    expect(game.phaseInterceptor.log.includes("LearnMovePhase")).toBe(false);
  });
});
