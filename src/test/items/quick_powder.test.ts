import { Stat } from "#enums/stat";
import { SpeciesStatBoosterModifier } from "#app/modifier/modifier";
import { modifierTypes } from "#app/modifier/modifier-type";
import i18next from "#app/plugins/i18n";
import * as Utils from "#app/utils";
import { Species } from "#enums/species";
import GameManager from "#test/utils/gameManager";
import Phase from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Items - Quick Powder", () => {
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

  it("QUICK_POWDER activates in battle correctly", async () => {
    game.override.startingHeldItems([{ name: "SPECIES_STAT_BOOSTER", type: "QUICK_POWDER" }]);
    const consoleSpy = vi.spyOn(console, "log");
    await game.startBattle([Species.DITTO]);

    const partyMember = game.scene.getPlayerParty()[0];

    // Checking console log to make sure Quick Powder is applied when getEffectiveStat (with the appropriate stat) is called
    partyMember.getEffectiveStat(Stat.DEF);
    expect(consoleSpy).not.toHaveBeenLastCalledWith(
      "Applied",
      i18next.t("modifierType:SpeciesBoosterItem.QUICK_POWDER.name"),
      "",
    );

    // Printing dummy console messages along the way so subsequent checks don't pass because of the first
    console.log("");

    partyMember.getEffectiveStat(Stat.SPDEF);
    expect(consoleSpy).not.toHaveBeenLastCalledWith(
      "Applied",
      i18next.t("modifierType:SpeciesBoosterItem.QUICK_POWDER.name"),
      "",
    );

    console.log("");

    partyMember.getEffectiveStat(Stat.ATK);
    expect(consoleSpy).not.toHaveBeenLastCalledWith(
      "Applied",
      i18next.t("modifierType:SpeciesBoosterItem.QUICK_POWDER.name"),
      "",
    );

    console.log("");

    partyMember.getEffectiveStat(Stat.SPATK);
    expect(consoleSpy).not.toHaveBeenLastCalledWith(
      "Applied",
      i18next.t("modifierType:SpeciesBoosterItem.QUICK_POWDER.name"),
      "",
    );

    console.log("");

    partyMember.getEffectiveStat(Stat.SPD);
    expect(consoleSpy).toHaveBeenLastCalledWith(
      "Applied",
      i18next.t("modifierType:SpeciesBoosterItem.QUICK_POWDER.name"),
      "",
    );
  });

  it("QUICK_POWDER held by DITTO", async () => {
    await game.startBattle([Species.DITTO]);

    const partyMember = game.scene.getPlayerParty()[0];

    const spdStat = partyMember.getStat(Stat.SPD);

    // Making sure modifier is not applied without holding item
    const spdValue = new Utils.NumberHolder(spdStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["QUICK_POWDER"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(2);
  }, 20000);

  it("QUICK_POWDER held by fused DITTO (base)", async () => {
    await game.startBattle([Species.DITTO, Species.MAROWAK]);

    const partyMember = game.scene.getPlayerParty()[0];
    const ally = game.scene.getPlayerParty()[1];

    // Fuse party members (taken from PlayerPokemon.fuse(...) function)
    partyMember.fusionSpecies = ally.species;
    partyMember.fusionFormIndex = ally.formIndex;
    partyMember.fusionAbilityIndex = ally.abilityIndex;
    partyMember.fusionShiny = ally.shiny;
    partyMember.fusionVariant = ally.variant;
    partyMember.fusionGender = ally.gender;
    partyMember.fusionLuck = ally.luck;

    const spdStat = partyMember.getStat(Stat.SPD);

    // Making sure modifier is not applied without holding item
    const spdValue = new Utils.NumberHolder(spdStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["QUICK_POWDER"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(2);
  }, 20000);

  it("QUICK_POWDER held by fused DITTO (part)", async () => {
    await game.startBattle([Species.MAROWAK, Species.DITTO]);

    const partyMember = game.scene.getPlayerParty()[0];
    const ally = game.scene.getPlayerParty()[1];

    // Fuse party members (taken from PlayerPokemon.fuse(...) function)
    partyMember.fusionSpecies = ally.species;
    partyMember.fusionFormIndex = ally.formIndex;
    partyMember.fusionAbilityIndex = ally.abilityIndex;
    partyMember.fusionShiny = ally.shiny;
    partyMember.fusionVariant = ally.variant;
    partyMember.fusionGender = ally.gender;
    partyMember.fusionLuck = ally.luck;

    const spdStat = partyMember.getStat(Stat.SPD);

    // Making sure modifier is not applied without holding item
    const spdValue = new Utils.NumberHolder(spdStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["QUICK_POWDER"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(2);
  }, 20000);

  it("QUICK_POWDER not held by DITTO", async () => {
    await game.startBattle([Species.MAROWAK]);

    const partyMember = game.scene.getPlayerParty()[0];

    const spdStat = partyMember.getStat(Stat.SPD);

    // Making sure modifier is not applied without holding item
    const spdValue = new Utils.NumberHolder(spdStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["QUICK_POWDER"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPD, spdValue);

    expect(spdValue.value / spdStat).toBe(1);
  }, 20000);
});
