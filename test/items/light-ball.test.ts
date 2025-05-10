import { SpeciesStatBoosterModifier } from "#app/modifier/modifier";
import { modifierTypes } from "#app/modifier/modifier-types";
import { NumberHolder } from "#app/utils/common-utils";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phase from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Items - Light Ball", () => {
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

  it("LIGHT_BALL held by PIKACHU", async () => {
    await game.startBattle([SpeciesId.PIKACHU]);

    const partyMember = game.scene.getPlayerParty()[0];

    const atkStat = partyMember.getStat(Stat.ATK);
    const spAtkStat = partyMember.getStat(Stat.SPATK);

    // Making sure modifier is not applied without holding item
    const atkValue = new NumberHolder(atkStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.DEF, atkValue);
    const spAtkValue = new NumberHolder(spAtkStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPDEF, spAtkValue);

    expect(atkValue.value / atkStat).toBe(1);
    expect(spAtkValue.value / spAtkStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["LIGHT_BALL"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.ATK, atkValue);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPATK, spAtkValue);

    expect(atkValue.value / atkStat).toBe(2);
    expect(spAtkValue.value / spAtkStat).toBe(2);
  }, 20000);

  it("LIGHT_BALL not held by PIKACHU", async () => {
    await game.startBattle([SpeciesId.MAROWAK]);

    const partyMember = game.scene.getPlayerParty()[0];

    const atkStat = partyMember.getStat(Stat.ATK);
    const spAtkStat = partyMember.getStat(Stat.SPATK);

    // Making sure modifier is not applied without holding item
    const atkValue = new NumberHolder(atkStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.DEF, atkValue);
    const spAtkValue = new NumberHolder(spAtkStat);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPDEF, spAtkValue);

    expect(atkValue.value / atkStat).toBe(1);
    expect(spAtkValue.value / spAtkStat).toBe(1);

    // Giving Eviolite to party member and testing if it applies
    game.scene.addModifier(
      modifierTypes.SPECIES_STAT_BOOSTER().generateType([], ["LIGHT_BALL"])!.newModifier(partyMember),
      true,
    );
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.ATK, atkValue);
    game.scene.applyModifiers(SpeciesStatBoosterModifier, true, partyMember, Stat.SPATK, spAtkValue);

    expect(atkValue.value / atkStat).toBe(1);
    expect(spAtkValue.value / spAtkStat).toBe(1);
  }, 20000);
});
