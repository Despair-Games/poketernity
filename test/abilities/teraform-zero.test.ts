import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Teraform Zero", () => {
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
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { weatherName: "No Weather", weatherType: WeatherType.NONE },
    { weatherName: "Rain", weatherType: WeatherType.RAIN },
    { weatherName: "Strong Winds", weatherType: WeatherType.STRONG_WINDS },
  ])("should clear weather upon Terastallization if the current weather is $weatherName", async ({ weatherType }) => {
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    // Set weather manually. We cannot use the weather override because it also overrides Teraform Zero's effect.
    game.scene.arena.trySetWeather(weatherType, false);

    expect(game).toHaveWeather(weatherType);

    game.move.use(MoveId.SPLASH, 0, null, true); // Activate Terastallization

    await game.toEndOfTurn();

    expect(game).toHaveWeather(WeatherType.NONE);
  });

  it("should not clear weather if the ability is suppressed", async () => {
    game.override.enemyAbility(AbilityId.NEUTRALIZING_GAS);
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    // Set weather manually. We cannot use the weather override because it also overrides Teraform Zero's effect.
    game.scene.arena.trySetWeather(WeatherType.RAIN, false);

    expect(game).toHaveWeather(WeatherType.RAIN);

    game.move.use(MoveId.SPLASH, 0, null, true); // Activate Terastallization

    await game.toEndOfTurn();

    expect(game).toHaveWeather(WeatherType.RAIN);
  });

  it("should allow weather to be set again after Terastallization", async () => {
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.RAIN_DANCE, 0, null, true); // Activate Terastallization
    await game.move.forceEnemyMove(MoveId.SANDSTORM);

    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(game).toHaveWeather(WeatherType.RAIN);

    await game.toEndOfTurn();

    expect(game).toHaveWeather(WeatherType.SANDSTORM);
  });

  it.each([
    { terrainName: "No Terrain", terrainType: TerrainType.NONE },
    { terrainName: "Psychic Terrain", terrainType: TerrainType.PSYCHIC },
  ])("should clear terrain upon Terastallization if the current terrain is $terrainName", async ({ terrainType }) => {
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    // Set terrain manually. We cannot use the terrain override because it also overrides Teraform Zero's effect.
    game.scene.arena.trySetTerrain(terrainType, false);

    expect(game).toHaveTerrain(terrainType);

    game.move.use(MoveId.SPLASH, 0, null, true); // Activate Terastallization

    await game.toEndOfTurn();

    expect(game).toHaveTerrain(TerrainType.NONE);
  });

  it("should not clear terrain if the ability is suppressed", async () => {
    game.override.enemyAbility(AbilityId.NEUTRALIZING_GAS);
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    // Set terrain manually. We cannot use the terrain override because it also overrides Teraform Zero's effect.
    game.scene.arena.trySetTerrain(TerrainType.MISTY, false);

    expect(game).toHaveTerrain(TerrainType.MISTY);

    game.move.use(MoveId.SPLASH, 0, null, true); // Activate Terastallization

    await game.toEndOfTurn();

    expect(game).toHaveTerrain(TerrainType.MISTY);
  });

  it("should allow terrain to be set again after Terastallization", async () => {
    await game.classicMode.startBattle(SpeciesId.TERAPAGOS);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.ELECTRIC_TERRAIN, 0, null, true); // Activate Terastallization
    await game.move.forceEnemyMove(MoveId.PSYCHIC_TERRAIN);

    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(game).toHaveTerrain(TerrainType.ELECTRIC);

    await game.toEndOfTurn();

    expect(game).toHaveTerrain(TerrainType.PSYCHIC);
  });
});
