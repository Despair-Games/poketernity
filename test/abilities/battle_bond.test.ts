import { allMoves } from "#app/data/data-lists";
import { MultiHitAttr } from "#app/data/move-attrs/multi-hit-attr";
import { MultiHitType } from "#enums/multi-hit-type";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - BATTLE BOND", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const baseForm = 1;
  const ashForm = 2;

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
      .battleType("single")
      .startingWave(4) // Leads to arena reset on Wave 5 trainer battle
      .ability(Abilities.BATTLE_BOND)
      .starterForms({ [Species.GRENINJA]: ashForm })
      .moveset([MoveId.SPLASH, MoveId.WATER_SHURIKEN])
      .enemySpecies(Species.BULBASAUR)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100) // Avoid levelling up
      .enemyLevel(1000); // Avoid opponent dying before `doKillOpponents()`
  });

  it("check if fainted pokemon switches to base form on arena reset", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP, Species.GRENINJA]);

    const greninja = game.scene.getPlayerParty()[1];
    expect(greninja.formIndex).toBe(ashForm);

    greninja.faint();
    expect(greninja.isFainted()).toBe(true);

    game.move.select(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.toEndOfTurn();
    game.doSelectModifier();
    await game.phaseInterceptor.to("QuietFormChangePhase");

    expect(greninja.formIndex).toBe(baseForm);
  });

  it("should not keep buffing Water Shuriken after Greninja switches to base form", async () => {
    await game.classicMode.startBattle([Species.GRENINJA]);

    const waterShuriken = allMoves[MoveId.WATER_SHURIKEN];
    vi.spyOn(waterShuriken, "calculateBattlePower");

    let actualMultiHitType: MultiHitType | null = null;
    const multiHitAttr = waterShuriken.getAttrs(MultiHitAttr)[0];
    vi.spyOn(multiHitAttr, "getHitCount").mockImplementation(() => {
      actualMultiHitType = multiHitAttr.getMultiHitType();
      return 3;
    });

    // Wave 4: Use Water Shuriken in Ash form
    let expectedBattlePower = 20;
    let expectedMultiHitType = MultiHitType._3;

    game.move.select(MoveId.WATER_SHURIKEN);
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(waterShuriken.calculateBattlePower).toHaveLastReturnedWith(expectedBattlePower);
    expect(actualMultiHitType).toBe(expectedMultiHitType);

    await game.doKillOpponents();
    await game.toNextWave();

    // Wave 5: Use Water Shuriken in base form
    expectedBattlePower = 15;
    expectedMultiHitType = MultiHitType._2_TO_5;

    game.move.select(MoveId.WATER_SHURIKEN);
    await game.toEndOfTurn();
    expect(waterShuriken.calculateBattlePower).toHaveLastReturnedWith(expectedBattlePower);
    expect(actualMultiHitType).toBe(expectedMultiHitType);
  });
});
