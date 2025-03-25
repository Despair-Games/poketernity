import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
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
      .moveset([MoveId.CHILLY_RECEPTION, MoveId.SNOWSCAPE])
      .enemyMoveset(Array(4).fill(MoveId.SPLASH))
      .enemyAbility(AbilityId.NONE)
      .ability(AbilityId.NONE);
  });

  it("should still change the weather if user can't switch out", async () => {
    await game.classicMode.startBattle([SpeciesId.SLOWKING]);

    game.move.select(MoveId.CHILLY_RECEPTION);

    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
  });

  it("should switch out even if it's snowing", async () => {
    await game.classicMode.startBattle([SpeciesId.SLOWKING, SpeciesId.MEOWTH]);
    // first turn set up snow with snowscape, try chilly reception on second turn
    game.move.select(MoveId.SNOWSCAPE);
    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);

    await game.phaseInterceptor.to("TurnInitPhase", false);
    game.move.select(MoveId.CHILLY_RECEPTION);
    game.doSelectPartyPokemon(1);

    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
    expect(game.scene.getPlayerField()[0].species.speciesId).toBe(SpeciesId.MEOWTH);
  });

  it("happy case - switch out and weather changes", async () => {
    await game.classicMode.startBattle([SpeciesId.SLOWKING, SpeciesId.MEOWTH]);

    game.move.select(MoveId.CHILLY_RECEPTION);
    game.doSelectPartyPokemon(1);

    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
    expect(game.scene.getPlayerField()[0].species.speciesId).toBe(SpeciesId.MEOWTH);
  });

  // enemy uses another move and weather doesn't change
  it("check case - enemy not selecting chilly reception doesn't change weather ", async () => {
    game.override
      .battleType("single")
      .enemyMoveset([MoveId.CHILLY_RECEPTION, MoveId.TACKLE])
      .enemyAbility(AbilityId.NONE)
      .moveset(Array(4).fill(MoveId.SPLASH));

    await game.classicMode.startBattle([SpeciesId.SLOWKING, SpeciesId.MEOWTH]);

    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.TACKLE);

    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(undefined);
  });

  it("enemy trainer - expected behavior ", async () => {
    game.override
      .battleType("single")
      .startingWave(8)
      .enemyMoveset(Array(4).fill(MoveId.CHILLY_RECEPTION))
      .enemyAbility(AbilityId.NONE)
      .enemySpecies(SpeciesId.MAGIKARP)
      .moveset([MoveId.SPLASH, MoveId.THUNDERBOLT]);

    await game.classicMode.startBattle([SpeciesId.JOLTEON]);
    const RIVAL_MAGIKARP1 = game.scene.getEnemyPokemon()?.id;

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
    expect(game.scene.getEnemyPokemon()?.id !== RIVAL_MAGIKARP1);

    await game.phaseInterceptor.to("TurnInitPhase", false);
    game.move.select(MoveId.SPLASH);

    // second chilly reception should still switch out
    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
    await game.phaseInterceptor.to("TurnInitPhase", false);
    expect(game.scene.getEnemyPokemon()?.id === RIVAL_MAGIKARP1);
    game.move.select(MoveId.THUNDERBOLT);

    // enemy chilly recep move should fail: it's snowing and no option to switch out
    // no crashing
    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
    await game.phaseInterceptor.to("TurnInitPhase", false);
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SNOW);
  });
});
