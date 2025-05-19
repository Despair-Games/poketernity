import { SUNNY_WEATHER_TYPES } from "#constants/weather-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";
import type { PlayerPokemon } from "#field/player-pokemon";
import { GameManager } from "#test/test-utils/game-manager";
import { getTSEnumKeys, toDmgValue } from "#utils/common-utils";
import { capitalizeString } from "#utils/string-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

//#region Test Constants

const allWeathers = getTSEnumKeys(WeatherType).map((key) => ({
  weatherName: key === "NONE" ? "no" : capitalizeString(key, "_", false, true),
  weatherType: WeatherType[key],
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
      .battleType("single")
      .disableCrits()
      .startingLevel(100)
      .ability(AbilityId.SOLAR_POWER)
      .passiveAbility(AbilityId.OVERCOAT) // so hail/sandstorm doesn't damage it. This does not cancel the solar-power damage side-effect
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(100);
  });

  //#region Affected Weathers

  describe.each(affectedWeathers)("In affected $weatherName weather", ({ weatherName, weatherType }) => {
    let playerPkm: PlayerPokemon;

    beforeEach(async () => {
      game.override.weather(weatherType);
      await game.classicMode.startBattle([SpeciesId.CHARMANDER]);
      playerPkm = game.field.getPlayerPokemon();
      expect(game).toHaveWeather(weatherType);
    });

    it(`should boost SPATK by x1.5 in ${weatherName} weather`, async () => {
      const baseSpAtk = playerPkm.getStat(Stat.SPATK);
      expect(playerPkm).toHaveEffectiveStat(Stat.SPATK, baseSpAtk * 1.5);
    });

    it(`should deal 1/8 of max-HP damage to the owner in ${weatherName} weather`, async () => {
      const expectedDamage = toDmgValue(playerPkm.getMaxHp() / 8);

      game.move.use(MoveId.SPLASH);
      await game.toNextTurn();

      expect(playerPkm).toHaveTakenDamage(expectedDamage);
    });

    it(`should do nothing in ${weatherName} weather if Cloud Nine is active`, async () => {
      game.override.enemyAbility(AbilityId.CLOUD_NINE);

      const baseSpAtk = playerPkm.getStat(Stat.SPATK);
      expect(playerPkm).toHaveEffectiveStat(Stat.SPATK, baseSpAtk);

      game.move.use(MoveId.SPLASH);
      await game.toNextTurn();

      expect(playerPkm).toHaveFullHp();
    });
  });

  it("should NOT deal 1/8 of max-HP damage to the owner if Sunny weather ends in the same turn", async () => {
    const { override, classicMode, field, move } = game;
    override.newWeatherDuration(2);

    await classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPkm = field.getPlayerPokemon();
    const expectedDamages = [toDmgValue(playerPkm.getMaxHp() / 8), toDmgValue(playerPkm.getMaxHp() / 4)];

    move.use(MoveId.SUNNY_DAY);
    await game.toNextTurn();
    expect(game).toHaveWeather(WeatherType.SUNNY);
    expect(playerPkm).toHaveTakenDamage(expectedDamages[0]);

    move.use(MoveId.SPLASH);
    await game.toNextTurn();

    expect(playerPkm).not.toHaveTakenDamage(expectedDamages[1]);
    expect(game).not.toHaveWeather(WeatherType.SUNNY);
  });

  it("should NOT deal 1/8 of max-HP damage to the owner if Harsh Sun ends in the same turn", async () => {
    const { override, classicMode, phaseInterceptor, field, move } = game;
    override.enemyAbility(AbilityId.DESOLATE_LAND);
    await classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPkm = field.getPlayerPokemon();
    const enemeyPokemon = field.getEnemyPokemon();

    expect(game).toHaveWeather(WeatherType.HARSH_SUN);
    move.use(MoveId.SPLASH);
    await game.faintPokemon(enemeyPokemon); // Harsh Sun ends in the same turn by fainting the opponent
    await phaseInterceptor.to("SelectModifierPhase", false);

    expect(playerPkm).toHaveFullHp();
    expect(game).not.toHaveWeather(WeatherType.HARSH_SUN);
  });

  //#endregion
  //#region Unaffected Weathers

  describe.each(unaffectedWeathers)("In unaffected $weatherName weather", ({ weatherName, weatherType }) => {
    let playerPkm: PlayerPokemon;

    beforeEach(async () => {
      game.override.weather(weatherType);
      await game.classicMode.startBattle([SpeciesId.CHARMANDER]);
      playerPkm = game.field.getPlayerPokemon();
      expect(game).toHaveWeather(weatherType);
    });

    it(`should NOT boost SPATK in ${weatherName} weather`, async () => {
      const baseSpAtk = playerPkm.getStat(Stat.SPATK);

      game.move.use(MoveId.EMBER);
      await game.toNextTurn();

      expect(playerPkm).toHaveEffectiveStat(Stat.SPATK, baseSpAtk);
    });

    it(`should NOT deal 1/8 of max-HP damage to the owner in ${weatherName} weather`, async () => {
      // game.override.passiveAbility(AbilityId.OVERCOAT);
      game.move.use(MoveId.SPLASH);
      await game.toNextTurn();

      expect(playerPkm).toHaveFullHp();
    });
  });

  //#endregion
});
