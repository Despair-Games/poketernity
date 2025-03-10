import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { TerrainType } from "#enums/terrain-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Grassy Glide", () => {
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
      .enemySpecies(Species.REGIELEKI)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyPassiveAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should have increased priority with active Grassy Terrain", async () => {
    game.override.ability(Abilities.GRASSY_SURGE);
    await game.classicMode.startBattle([Species.SHUCKLE]);

    game.move.use(MoveId.GRASSY_GLIDE);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTerrainType()).toEqual(TerrainType.GRASSY);
    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
  });

  it.each([
    { terrain: "active Electric Terrain", terrainAbility: Abilities.ELECTRIC_SURGE, terrainType: TerrainType.ELECTRIC },
    { terrain: "active Misty Terrain", terrainAbility: Abilities.MISTY_SURGE, terrainType: TerrainType.MISTY },
    { terrain: "active Psychic Terrain", terrainAbility: Abilities.PSYCHIC_SURGE, terrainType: TerrainType.PSYCHIC },
    { terrain: "no active terrain", terrainAbility: Abilities.BALL_FETCH, terrainType: TerrainType.NONE },
  ])("should not have increased priority with $terrain", async ({ terrainAbility, terrainType }) => {
    game.override.ability(terrainAbility);
    await game.classicMode.startBattle([Species.SHUCKLE]);

    game.move.use(MoveId.GRASSY_GLIDE);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTerrainType()).toEqual(terrainType);
    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
  });

  it("should not have increased priority if the user is ungrounded in Grassy Terrain", async () => {
    game.override.ability(Abilities.GRASSY_SURGE);
    await game.classicMode.startBattle([Species.VESPIQUEN]);

    game.move.use(MoveId.GRASSY_GLIDE);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTerrainType()).toEqual(TerrainType.GRASSY);
    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
  });
});
