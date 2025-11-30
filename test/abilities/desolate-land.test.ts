import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import * as RNGUtils from "#utils/random-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Desolate Land", () => {
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
      .enemyLevel(1)
      .startingLevel(100)
      .ability(AbilityId.NO_GUARD)
      .enemySpecies(SpeciesId.RALTS)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should lift only when all pokemon with this ability leave the field", async () => {
    game.override //
      .battleType("double")
      .hasPassiveAbility(true);
    await game.classicMode.startBattle(SpeciesId.MAGCARGO, SpeciesId.MAGCARGO, SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    expect(game).toHaveWeather(WeatherType.HARSH_SUN);

    vi.spyOn(RNGUtils, "randSeedItem").mockImplementation((items: any[]) => {
      return items[0]; // force out magikarp
    });

    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.SPLASH, 1);

    await game.move.forceEnemyMove(MoveId.ROAR, BattlerIndex.PLAYER);
    await game.move.forceEnemyMove(MoveId.SPLASH);

    await game.toEndOfTurn();

    expect(game).toHaveWeather(WeatherType.HARSH_SUN);

    await game.toNextTurn();

    vi.spyOn(RNGUtils, "randSeedItem").mockImplementation((items: any[]) => {
      return items[1]; // force out feebas
    });

    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.SPLASH, 1);

    await game.move.forceEnemyMove(MoveId.ROAR, BattlerIndex.PLAYER_2);
    await game.move.forceEnemyMove(MoveId.SPLASH);

    await game.toEndOfTurn();

    expect(game).not.toHaveWeather(WeatherType.HARSH_SUN);
  });

  it("should lift when enemy faints", async () => {
    game.override //
      .battleType("single")
      .enemySpecies(SpeciesId.MAGCARGO)
      .enemyHasPassiveAbility(true);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    expect(game).toHaveWeather(WeatherType.HARSH_SUN);

    game.move.use(MoveId.SHEER_COLD);

    await game.toEndOfTurn();

    expect(game).not.toHaveWeather(WeatherType.HARSH_SUN);
  });

  it("should lift when pokemon returns upon switching from double to single battle", async () => {
    game.override //
      .battleType("even-doubles")
      .startingWave(2)
      .hasPassiveAbility(true);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.MAGCARGO);

    expect(game).toHaveWeather(WeatherType.HARSH_SUN);

    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.SPLASH, 1);
    await game.move.forceEnemyMove(MoveId.MEMENTO, 0);
    await game.move.forceEnemyMove(MoveId.MEMENTO, 1);

    await game.toEndOfTurn();

    expect(game).toHaveWeather(WeatherType.HARSH_SUN);

    await game.toNextWave();

    expect(game).not.toHaveWeather(WeatherType.HARSH_SUN);
  });

  it("should lift when enemy is captured", async () => {
    game.override //
      .battleType("single")
      .enemySpecies(SpeciesId.MAGCARGO)
      .enemyHasPassiveAbility(true);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    expect(game).toHaveWeather(WeatherType.HARSH_SUN);

    game.scene.pokeballCounts[PokeballType.MASTER_BALL] = 1;

    game.throwPokeball(PokeballType.MASTER_BALL);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game).not.toHaveWeather(WeatherType.HARSH_SUN);
  });
});
