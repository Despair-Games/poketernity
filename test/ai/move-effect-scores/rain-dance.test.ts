import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Rain Dance", () => {
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
      .enemyMoveset([MoveId.RAIN_DANCE, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when no synergy is on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.WHISMUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.RAIN_DANCE);
  });

  it("should be preferred when the user is Water-type", async () => {
    game.override.enemySpecies(SpeciesId.MAGIKARP);

    await game.classicMode.startBattle(SpeciesId.WHISMUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.RAIN_DANCE);
  });

  it("should be avoided when the opponent is Water-type", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.RAIN_DANCE);
  });

  it("should be strongly preferred when the user is Water-type under Sun", async () => {
    game.override.enemySpecies(SpeciesId.MAGIKARP).weather(WeatherType.SUNNY);

    await game.classicMode.startBattle(SpeciesId.WHISMUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.RAIN_DANCE);
  });

  type AbilityTestCase = { name: string; id: AbilityId };
  const abilityTestCases: AbilityTestCase[] = [
    { name: "Swift Swim", id: AbilityId.SWIFT_SWIM },
    { name: "Rain Dish", id: AbilityId.RAIN_DISH },
    { name: "Dry Skin", id: AbilityId.DRY_SKIN },
    // TODO: Hydration's condition interferes with `hasAbility` checks
    // { name: "Hydration", id: AbilityId.HYDRATION },
    { name: "Forecast", id: AbilityId.FORECAST },
  ];

  it.each(abilityTestCases)("should be preferred when the user has $name", async ({ id }) => {
    game.override.enemyAbility(id);

    await game.classicMode.startBattle(SpeciesId.MELTAN);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.RAIN_DANCE);
  });

  it.each(abilityTestCases)("should be avoided when the opponent is known to have $name", async ({ id }) => {
    game.override.ability(id);

    await game.classicMode.startBattle(SpeciesId.MELTAN);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toNeverSelectMove(MoveId.RAIN_DANCE);

    game.field.revealAllAbilities();
    expect(enemy).toNeverSelectMove(MoveId.RAIN_DANCE);
  });

  type MoveTestCase = { name: string; id: MoveId };
  const moveTestCases: MoveTestCase[] = [
    { name: "Weather Ball", id: MoveId.WEATHER_BALL },
    { name: "Thunder", id: MoveId.THUNDER },
    { name: "Hurricane", id: MoveId.HURRICANE },
    { name: "Bleakwind Storm", id: MoveId.BLEAKWIND_STORM },
    { name: "Wildbolt Storm", id: MoveId.WILDBOLT_STORM },
    { name: "Sandsear Storm", id: MoveId.SANDSEAR_STORM },
    { name: "Electro Shot", id: MoveId.ELECTRO_SHOT },
  ];

  it.each(moveTestCases)("should be preferred when the user knows $name", async ({ id }) => {
    game.override.enemySpecies(SpeciesId.MUNCHLAX).enemyMoveset([MoveId.RAIN_DANCE, id]);

    await game.classicMode.startBattle(SpeciesId.BLISSEY);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.RAIN_DANCE);
  });
});
