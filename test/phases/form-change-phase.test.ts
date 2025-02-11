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
import { pokemonFormChanges } from "#app/data/pokemon-forms";
import { FormChangePhase } from "#app/phases/form-change-phase";

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
      .startingModifier([{ name: "DYNAMAX_BAND" }]);
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
  });

  it("should not allow a Pokemon reverting into its normal form to learn its respective G-Max move", async () => {
    game.override.starterForms({ [Species.RILLABOOM]: 1 }).startingHeldItems([{ name: "RARE_FORM_CHANGE_ITEM" }]);
    await game.classicMode.startBattle([Species.RILLABOOM]);

    // Before the form change: Should be G-Max form
    const rillaboom = game.scene.getPlayerParty()[0];
    expect(rillaboom.getFormKey()).toBe("gigantamax");
    expect(rillaboom.moveset.map((m) => m.moveId)).not.toContain(MoveId.G_MAX_DRUM_SOLO);

    // Manually trigger a form change
    game.scene.unshiftPhase(new FormChangePhase(rillaboom, pokemonFormChanges[Species.RILLABOOM][1], false));

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    // After the form change: Should be normal form
    expect(game.phaseInterceptor.log.includes("FormChangePhase")).toBe(true);
    expect(rillaboom.getFormKey()).toBe("");
    expect(rillaboom.moveset.map((m) => m.moveId)).not.toContain(MoveId.G_MAX_DRUM_SOLO);
  });
});
