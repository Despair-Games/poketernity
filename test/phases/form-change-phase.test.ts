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
      .moveset([MoveId.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should not be cancellable", async () => {
    await game.classicMode.startBattle([Species.ZACIAN]);

    // Before the form change: Should be Hero form
    const zacian = game.scene.getPlayerParty()[0];
    expect(zacian.getFormKey()).toBe("hero-of-many-battles");
    expect(zacian.getTypes()).toStrictEqual([ElementalType.FAIRY]);
    expect(zacian.calculateBaseStats()).toStrictEqual([92, 120, 115, 80, 115, 138]);

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

    game.move.select(MoveId.SPLASH);
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
  });
});
