import { allAbilities } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { type EffectiveStat, Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Ability - Treasures Of Ruin", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("double")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  type TestCase = {
    abilityName: string;
    abilityId: AbilityId;
    statName: string;
    stat: EffectiveStat;
  };
  const testCases: TestCase[] = [
    {
      abilityName: "Tablets of Ruin",
      abilityId: AbilityId.TABLETS_OF_RUIN,
      statName: "Attack",
      stat: Stat.ATK,
    },
    {
      abilityName: "Vessel of Ruin",
      abilityId: AbilityId.VESSEL_OF_RUIN,
      statName: "Sp. Atk",
      stat: Stat.SPATK,
    },
    {
      abilityName: "Sword of Ruin",
      abilityId: AbilityId.SWORD_OF_RUIN,
      statName: "Defense",
      stat: Stat.DEF,
    },
    {
      abilityName: "Beads of Ruin",
      abilityId: AbilityId.BEADS_OF_RUIN,
      statName: "Sp. Def",
      stat: Stat.SPDEF,
    },
  ];

  describe.each(testCases)("$abilityName", ({ abilityId, statName, stat }) => {
    it(`should reduce the ${statName} of all Pokemon other than the source`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      const [magikarp, feebas] = game.scene.getPlayerField();
      vi.spyOn(magikarp, "getAbility").mockReturnValue(allAbilities[abilityId]);

      expect(magikarp).toHaveEffectiveStat(stat, magikarp.getStat(stat));
      for (const p of [feebas, ...game.scene.getEnemyField()]) {
        expect(p).toHaveEffectiveStat(stat, Math.floor(p.getStat(stat) * 0.75));
      }
    });

    it(`should properly reduce ${statName} when multiple instances are present`, async () => {
      game.override.ability(abilityId);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      // allies with the Ruin ability should not have their stats reduced
      game.scene.getPlayerField().forEach((p) => expect(p).toHaveEffectiveStat(stat, p.getStat(stat)));
      // enemies without the Ruin ability should only have 1 stat reduction apply
      game.scene
        .getEnemyField()
        .forEach((p) => expect(p).toHaveEffectiveStat(stat, Math.floor(p.getStat(stat) * 0.75)));
    });
  });

  it("Different Ruin abilities should not interfere with each other", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerField();
    vi.spyOn(magikarp, "getAbility").mockReturnValue(allAbilities[AbilityId.TABLETS_OF_RUIN]);
    vi.spyOn(feebas, "getAbility").mockReturnValue(allAbilities[AbilityId.VESSEL_OF_RUIN]);

    for (const p of [magikarp, ...game.scene.getEnemyField()]) {
      expect(p).toHaveEffectiveStat(Stat.SPATK, Math.floor(p.getStat(Stat.SPATK) * 0.75));
    }

    for (const p of [feebas, ...game.scene.getEnemyField()]) {
      expect(p).toHaveEffectiveStat(Stat.ATK, Math.floor(p.getStat(Stat.ATK) * 0.75));
    }
  });
});
