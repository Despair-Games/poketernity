import { getEnumKeys } from "#app/utils";
import { SUNNY_WEATHER_TYPES } from "#app/utils/weather-utils";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

//#region Test Constants

const allWeathers = getEnumKeys(WeatherType).map((weatherName) => ({
  weatherName,
  weatherType: WeatherType[weatherName],
}));
const affectedWeathers = allWeathers.filter(({ weatherType }) => SUNNY_WEATHER_TYPES.includes(weatherType));
const unaffectedWeathers = allWeathers.filter(({ weatherType }) => !SUNNY_WEATHER_TYPES.includes(weatherType));

//#endregion

describe("Abilities - Solar Power", () => {
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
      .battleType("single")
      .disableCrits()
      .startingLevel(100)
      .moveset(MoveId.EMBER)
      .ability(AbilityId.SOLAR_POWER)
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(100);
  });

  it.each(affectedWeathers)("should have SPATK x1.5 in $weatherName weather", async ({ weatherType }) => {
    game.override.weather(weatherType);

    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const player = game.scene.getPlayerPokemon()!;
    const spAtk = player.getStat(Stat.SPATK);

    game.move.select(MoveId.EMBER);
    await game.toNextTurn();

    expect(player).toHaveEffectiveStat(Stat.SPATK, spAtk * 1.5);
  });

  console.log("unaffectedWeathers", unaffectedWeathers);

  it.each(unaffectedWeathers)("should have no effect in $weatherName weather", async ({ weatherType }) => {
    game.override.weather(weatherType);
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const player = game.scene.getPlayerPokemon()!;
    const spAtk = player.getStat(Stat.SPATK);

    game.move.select(MoveId.EMBER);
    await game.toNextTurn();

    expect(player).toHaveEffectiveStat(Stat.SPATK, spAtk);
  });

  it.todo("should deal 1/8 of HP damage to the owner in sunny weather");

  it.todo("should NOT deal 1/8 of HP damage to the owner in non-sunny weather");

  it.todo("should NOT deal 1/8 of HP damage to the owner if sunny weather ends in the same turn");
});
