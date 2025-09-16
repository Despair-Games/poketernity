import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Chilly Reception", () => {
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
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .enemySpecies(SpeciesId.MAGIKARP);
  });

  it("should still change the weather if user can't switch out", async () => {
    await game.classicMode.startBattle(SpeciesId.SLOWKING);

    game.move.use(MoveId.CHILLY_RECEPTION);

    await game.toEndOfTurn();
    expect(game).toHaveWeather(WeatherType.SNOW);
  });

  it("should switch out even if it's snowing", async () => {
    await game.classicMode.startBattle(SpeciesId.SLOWKING, SpeciesId.MEOWTH);

    game.move.use(MoveId.SNOWSCAPE);
    await game.toNextTurn();
    expect(game).toHaveWeather(WeatherType.SNOW);

    game.move.use(MoveId.CHILLY_RECEPTION);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(game).toHaveWeather(WeatherType.SNOW);
    expect(game.field.getPlayerPokemon().species.speciesId).toBe(SpeciesId.MEOWTH);
  });

  it("should switch the user out and change the weather", async () => {
    await game.classicMode.startBattle(SpeciesId.SLOWKING, SpeciesId.MEOWTH);

    game.move.use(MoveId.CHILLY_RECEPTION);
    game.selectPartyPokemon(1);

    await game.toEndOfTurn();
    expect(game).toHaveWeather(WeatherType.SNOW);
    expect(game.field.getPlayerPokemon().species.speciesId).toBe(SpeciesId.MEOWTH);
  });

  it("shouldn't change the weather when the enemy simulates move usage", async () => {
    game.override
      .battleType("single")
      .enemyMoveset([MoveId.CHILLY_RECEPTION, MoveId.TACKLE])
      .enemyAbility(AbilityId.NONE);

    await game.classicMode.startBattle(SpeciesId.SLOWKING, SpeciesId.MEOWTH);

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.TACKLE);

    await game.toEndOfTurn();
    expect(game).toHaveWeather(WeatherType.NONE);
  });

  it("should work normally in trainer battles", async () => {
    game.override
      .battleType("single")
      .startingWave(8)
      .enemyMoveset(MoveId.CHILLY_RECEPTION)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemySpecies(SpeciesId.MAGIKARP);

    await game.classicMode.startBattle(SpeciesId.JOLTEON);
    const RIVAL_MAGIKARP1 = game.field.getEnemyPokemon().id;

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    expect(game).toHaveWeather(WeatherType.SNOW);
    expect(game.field.getEnemyPokemon().id !== RIVAL_MAGIKARP1);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();
    // second chilly reception should still switch out
    expect(game).toHaveWeather(WeatherType.SNOW);
    expect(game.field.getEnemyPokemon().id === RIVAL_MAGIKARP1);

    // enemy chilly recep move should fail: it's snowing and no option to switch out
    // no crashing
    game.move.use(MoveId.THUNDERBOLT);
    await game.toNextTurn();
    expect(game).toHaveWeather(WeatherType.SNOW);

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game).toHaveWeather(WeatherType.SNOW);
  });
});
