import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { SpeciesStatBoosterModifier } from "#modifier/modifier";
import { modifierTypes } from "#modifier/modifier-types";
import { GameManager } from "#test/test-utils/game-manager";
import { NumberHolder } from "#utils/common-utils";
import Phase from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Items - Metal Powder", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phase.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.override.battleType("single");
  });

  it("METAL_POWDER held by DITTO", async () => {
    await game.classicMode.startBattle(SpeciesId.DITTO);

    const partyMember = game.scene.getPlayerParty()[0];

    const defStat = partyMember.getStat(Stat.DEF);

    // Making sure modifier is not applied without holding item
    const defValue = new NumberHolder(defStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.DEF, defValue);

    expect(defValue.value / defStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["METAL_POWDER"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.DEF, defValue);

    expect(defValue.value / defStat).toBe(2);
  }, 20000);

  it("METAL_POWDER not held by DITTO", async () => {
    await game.classicMode.startBattle(SpeciesId.MAROWAK);

    const partyMember = game.scene.getPlayerParty()[0];

    const defStat = partyMember.getStat(Stat.DEF);

    // Making sure modifier is not applied without holding item
    const defValue = new NumberHolder(defStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.DEF, defValue);

    expect(defValue.value / defStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["METAL_POWDER"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.DEF, defValue);

    expect(defValue.value / defStat).toBe(1);
  }, 20000);
});
