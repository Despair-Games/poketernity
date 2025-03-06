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
import { SpeciesFormKey } from "#enums/species-form-key";

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
      .startingLevel(100)
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingModifier([{ name: "DYNAMAX_BAND" }, { name: "MEGA_BRACELET" }]);
  });

  /**
   * A helper function to test form changes triggering learned moves.
   * @param newFormKey The form key of the form that the Pokemon will transform into.
   * @param moveId The ID of the move to check.
   * @param expectedToLearn If `true`, check that the move gets learned; otherwise, check that it does not get learned.
   */
  async function testMoveLearning(newFormKey: string, learnedMoveId: MoveId, expectedToLearn: boolean) {
    // Before the form change: Should be normal form
    const pokemon = game.scene.getPlayerParty()[0];
    expect(pokemon.getFormKey()).toBe("");
    expect(pokemon.moveset.map((m) => m.moveId)).not.toContain(learnedMoveId);

    // Give a form change item to activate the form change
    const formChangeItemType =
      generateModifierType(modifierTypes.RARE_FORM_CHANGE_ITEM)
      ?? generateModifierType(modifierTypes.FORM_CHANGE_ITEM)!;
    const formChangeItem = formChangeItemType.newModifier(pokemon);
    game.scene.addModifier(formChangeItem);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    // After the form change: Should be the desired new form
    expect(game.phaseInterceptor.log.includes("FormChangePhase")).toBe(true);
    expect(pokemon.getFormKey()).toBe(newFormKey);
    expect(pokemon.moveset.map((m) => m.moveId).includes(learnedMoveId)).toBe(expectedToLearn);
    expect(game.phaseInterceptor.log.includes("LearnMovePhase")).toBe(expectedToLearn);
  }

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

  it("should allow a G-Max Pokemon to learn its respective G-Max move at any level", async () => {
    game.override.startingLevel(1);
    await game.classicMode.startBattle([Species.RILLABOOM]);
    await testMoveLearning(SpeciesFormKey.GIGANTAMAX, MoveId.G_MAX_DRUM_SOLO, true);
  });

  it("should not cause a Mega-evolving Pokemon to learn a move", async () => {
    await game.classicMode.startBattle([Species.BEEDRILL]);
    await testMoveLearning(SpeciesFormKey.MEGA, MoveId.TWINEEDLE, false);
  });

  it("should allow learning certain moves at a high enough level", async () => {
    // For example, Hoopa-Unbound learns Hyperspace Fury at level 85
    game.override.startingLevel(85);
    await game.classicMode.startBattle([Species.HOOPA]);
    await testMoveLearning("unbound", MoveId.HYPERSPACE_FURY, true);
  });

  it("should not allow learning certain moves if not at a high enough level", async () => {
    // For example, Hoopa-Unbound learns Hyperspace Fury at level 85
    game.override.startingLevel(84);
    await game.classicMode.startBattle([Species.HOOPA]);
    await testMoveLearning("unbound", MoveId.HYPERSPACE_FURY, false);
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
