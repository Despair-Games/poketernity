import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { TerrainType } from "#enums/terrain-type";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Defog", () => {
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

  const baseMoveset: MoveId[] = [MoveId.DEFOG, MoveId.SPLASH, MoveId.TACKLE];

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .battleType("double")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100)
      .enemyMoveset(baseMoveset);
  });

  it("should not be preferred when no effects are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.DEFOG);
  });

  describe.each([
    { tagName: "Spikes", tagType: ArenaTagType.SPIKES },
    { tagName: "Toxic Spikes", tagType: ArenaTagType.TOXIC_SPIKES },
    { tagName: "Stealth Rock", tagType: ArenaTagType.STEALTH_ROCK },
    { tagName: "Sticky Web", tagType: ArenaTagType.STICKY_WEB },
    { tagName: "Sharp Steel", tagType: ArenaTagType.SHARP_STEEL },
  ])("Hazard Removal", ({ tagName, tagType }) => {
    it(`should be preferred when ${tagName} is on the user's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.ENEMY, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.DEFOG);
    });

    it(`should be avoided when ${tagName} is on the opponent's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.PLAYER, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.DEFOG);
    });
  });

  describe.each([
    { tagName: "Light Screen", tagType: ArenaTagType.LIGHT_SCREEN },
    { tagName: "Reflect", tagType: ArenaTagType.REFLECT },
    { tagName: "Aurora Veil", tagType: ArenaTagType.AURORA_VEIL },
    { tagName: "Safeguard", tagType: ArenaTagType.SAFEGUARD },
    // TODO: Because Mist blocks the evasiveness drop, Defog is
    // harshly penalized into it.
    // { tagName: "Mist", tagType: ArenaTagType.MIST },
  ])("Screen Removal", ({ tagName, tagType }) => {
    it(`should be preferred when ${tagName} is on the opponent's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.PLAYER, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.DEFOG);
    });

    // This may need to be removed or adjusted when scoring is added for Defog's evasion drop
    it(`should not gain or lose incentive when ${tagName} is only on the user's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.ENEMY, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toPreferSelectingMove(MoveId.DEFOG);
      expect(enemy).not.toNeverSelectMove(MoveId.DEFOG);
    });
  });

  type TerrainTestCase = {
    terrainName: string;
    terrainType: TerrainType;
    testSpecies: SpeciesId;
    testAbility?: { abilityName: string; abilityId: AbilityId };
  };
  const terrainTestCases: TerrainTestCase[] = [
    {
      terrainName: "Electric Terrain",
      terrainType: TerrainType.ELECTRIC,
      testSpecies: SpeciesId.CHINCHOU,
      testAbility: { abilityName: "Surge Surfer", abilityId: AbilityId.SURGE_SURFER },
    },
    {
      terrainName: "Grassy Terrain",
      terrainType: TerrainType.GRASSY,
      testSpecies: SpeciesId.LOTAD,
      testAbility: { abilityName: "Grass Pelt", abilityId: AbilityId.GRASS_PELT },
    },
    {
      terrainName: "Psychic Terrain",
      terrainType: TerrainType.PSYCHIC,
      testSpecies: SpeciesId.ESPURR,
    },
  ];

  describe.each(terrainTestCases)("$terrainName Removal", ({ terrainType, testSpecies, testAbility }) => {
    const initField = () => {
      game.scene.getField(true).forEach((p) => p.setStat(Stat.SPD, 50));
      game.scene.arena.trySetTerrain(terrainType, false, true);
    };

    it("Defog should be avoided when the current terrain favors the user", async () => {
      game.override.enemySpecies(testSpecies);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);
      initField();

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.DEFOG);
    });

    it("Defog should be favored when the current terrain favors the opponent", async () => {
      await game.classicMode.startBattle(testSpecies);
      initField();

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.DEFOG);
    });

    it("Defog should be avoided when the user has Terrain Pulse", async () => {
      game.override.enemyMoveset([MoveId.DEFOG, MoveId.TERRAIN_PULSE, MoveId.SPLASH, MoveId.TACKLE]);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);
      initField();

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.DEFOG);
    });

    it("Defog should be preferred when the enemy is known to have Terrain Pulse", async () => {
      game.override.moveset(MoveId.TERRAIN_PULSE);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);
      initField();

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toPreferSelectingMove(MoveId.DEFOG);

      game.field.revealAllMoves();
      expect(enemy).toPreferSelectingMove(MoveId.DEFOG);
    });

    if (testAbility == null) {
      return;
    }

    const { abilityName, abilityId } = testAbility;

    it(`Defog should be avoided when the user has ${abilityName}`, async () => {
      game.override.enemyAbility(abilityId);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);
      initField();

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.DEFOG);
    });

    it(`Defog should be preferred when the opponent is known to have ${abilityName}`, async () => {
      game.override.ability(abilityId);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);
      initField();

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toPreferSelectingMove(MoveId.DEFOG);

      game.field.revealAllAbilities();
      expect(enemy).toPreferSelectingMove(MoveId.DEFOG);
    });
  });
});
