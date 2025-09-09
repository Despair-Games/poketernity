import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Sunny Day", () => {
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
      .enemySpecies(SpeciesId.WHISMUR)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SUNNY_DAY, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when no synergy is on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.WHISMUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SUNNY_DAY);
  });

  it("should be preferred when the user is Fire-type", async () => {
    game.override.enemySpecies(SpeciesId.MAGBY);

    await game.classicMode.startBattle(SpeciesId.WHISMUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SUNNY_DAY);
  });

  it("should be avoided when the opponent is Fire-type", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGBY);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SUNNY_DAY);
  });

  it("should be avoided when the user is Water-type", async () => {
    game.override.enemySpecies(SpeciesId.MAGIKARP);

    await game.classicMode.startBattle(SpeciesId.WHISMUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SUNNY_DAY);
  });

  it("should be preferred when the opponent is Water-type", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SUNNY_DAY);
  });

  it("should be strongly preferred when the user is Fire-type and under Rain", async () => {
    game.override.enemySpecies(SpeciesId.MAGBY).weather(WeatherType.RAIN);

    await game.classicMode.startBattle(SpeciesId.WHISMUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.SUNNY_DAY);
  });

  type AbilityTestCase = { name: string; id: AbilityId };
  const abilityTestCases: AbilityTestCase[] = [
    { name: "Chlorophyll", id: AbilityId.CHLOROPHYLL },
    { name: "Solar Power", id: AbilityId.SOLAR_POWER },
    { name: "Flower Gift", id: AbilityId.FLOWER_GIFT },
    { name: "Leaf Guard", id: AbilityId.LEAF_GUARD },
    { name: "Protosynthesis", id: AbilityId.PROTOSYNTHESIS },
    { name: "Forecast", id: AbilityId.FORECAST },
  ];

  it.each(abilityTestCases)("should be preferred when the user has $name", async ({ id }) => {
    game.override.enemyAbility(id);

    await game.classicMode.startBattle(SpeciesId.MELTAN);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SUNNY_DAY);
  });

  it.each(abilityTestCases)("should be avoided when the opponent is known to have $name", async ({ id }) => {
    game.override.ability(id);

    await game.classicMode.startBattle(SpeciesId.MELTAN);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toNeverSelectMove(MoveId.SUNNY_DAY);

    game.field.revealAllAbilities();
    expect(enemy).toNeverSelectMove(MoveId.SUNNY_DAY);
  });

  type MoveTestCase = { name: string; id: MoveId };
  const moveTestCases: MoveTestCase[] = [
    { name: "Weather Ball", id: MoveId.WEATHER_BALL },
    // Growth's stat boost has the same expected score as Sunny Day in the test below
    // { name: "Growth", id: MoveId.GROWTH },
    { name: "Solar Beam", id: MoveId.SOLAR_BEAM },
    { name: "Solar Blade", id: MoveId.SOLAR_BLADE },
    { name: "Moonlight", id: MoveId.MOONLIGHT },
    { name: "Synthesis", id: MoveId.SYNTHESIS },
    { name: "Morning Sun", id: MoveId.MORNING_SUN },
    { name: "Hydro Steam", id: MoveId.HYDRO_STEAM },
  ];

  it.each(moveTestCases)("should be preferred when the user knows $name", async ({ id }) => {
    game.override.enemyMoveset([MoveId.SUNNY_DAY, id, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.REGISTEEL);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SUNNY_DAY);
  });
});
