import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";

describe("Abilities - Chlorophyll/Swift Swim/Sand Rush/Slush Rush", () => {
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
    game.overridesHelper
      .moveset([Moves.SPLASH])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it.each([
    { abilityName: "Swift Swim", ability: Abilities.SWIFT_SWIM, weatherType: WeatherType.RAIN, weatherName: "rain" },
    {
      abilityName: "Swift Swim",
      ability: Abilities.SWIFT_SWIM,
      weatherType: WeatherType.HEAVY_RAIN,
      weatherName: "heavy rain",
    },
    { abilityName: "Chlorophyll", ability: Abilities.CHLOROPHYLL, weatherType: WeatherType.SUNNY, weatherName: "sun" },
    {
      abilityName: "Chlorophyll",
      ability: Abilities.CHLOROPHYLL,
      weatherType: WeatherType.HARSH_SUN,
      weatherName: "harsh sun",
    },
    {
      abilityName: "Sand Rush",
      ability: Abilities.SAND_RUSH,
      weatherType: WeatherType.SANDSTORM,
      weatherName: "sandstorm",
    },
    { abilityName: "Slush Rush", ability: Abilities.SLUSH_RUSH, weatherType: WeatherType.HAIL, weatherName: "hail" },
    { abilityName: "Slush Rush", ability: Abilities.SLUSH_RUSH, weatherType: WeatherType.SNOW, weatherName: "snow" },
  ])("$abilityName should double the ability holder's speed in $weatherName", async ({ weatherType, ability }) => {
    game.overridesHelper.ability(ability).weather(weatherType);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const pokemon = game.scene.getPlayerPokemon()!;

    expect(pokemon.getEffectiveStat(Stat.SPD)).toBe(pokemon.stats[Stat.SPD] * 2);
  });

  it.each([
    { abilityName: "Swift Swim", ability: Abilities.SWIFT_SWIM },
    { abilityName: "Chlorophyll", ability: Abilities.CHLOROPHYLL },
    { abilityName: "Sand Rush", ability: Abilities.SAND_RUSH },
    { abilityName: "Slush Rush", ability: Abilities.SLUSH_RUSH },
  ])("$abilityName should not activate without weather", async ({ ability }) => {
    game.overridesHelper.ability(ability).weather(WeatherType.NONE);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const pokemon = game.scene.getPlayerPokemon()!;

    expect(pokemon.getEffectiveStat(Stat.SPD)).toBe(pokemon.stats[Stat.SPD]);
  });

  it.each([
    { abilityName: "Swift Swim", ability: Abilities.SWIFT_SWIM, weather: WeatherType.RAIN },
    { abilityName: "Chlorophyll", ability: Abilities.CHLOROPHYLL, weather: WeatherType.SUNNY },
    { abilityName: "Sand Rush", ability: Abilities.SAND_RUSH, weather: WeatherType.SANDSTORM },
    { abilityName: "Slush Rush", ability: Abilities.SLUSH_RUSH, weather: WeatherType.SNOW },
  ])("$abilityName should not activate if the current weather is being suppressed", async ({ ability, weather }) => {
    game.overridesHelper.ability(ability).weather(weather).enemyAbility(Abilities.CLOUD_NINE);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const pokemon = game.scene.getPlayerPokemon()!;

    expect(pokemon.getEffectiveStat(Stat.SPD)).toBe(pokemon.stats[Stat.SPD]);
  });
});
