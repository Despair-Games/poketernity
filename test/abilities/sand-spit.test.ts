import { WeatherType } from "#enums/weather-type";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Sand Spit", () => {
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
      .enemySpecies(Species.SILICOBRA)
      .enemyAbility(Abilities.SAND_SPIT)
      .enemyMoveset([MoveId.SPLASH])
      .moveset([MoveId.TACKLE, MoveId.WATERFALL, MoveId.SURF, MoveId.GROWL]);
  });

  it("should trigger when hit with damaging move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.TACKLE);
    await game.toNextTurn();

    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SANDSTORM);
  });

  it("should trigger when KO'd", async () => {
    game.override.startingLevel(1000).enemyLevel(1);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.WATERFALL);
    await game.phaseInterceptor.to("FaintPhase");

    expect(game.scene.arena.weather?.weatherType).toBe(WeatherType.SANDSTORM);
  });

  it("should not trigger when targetted with status moves", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    game.move.select(MoveId.GROWL);
    await game.toNextTurn();

    expect(game.scene.arena.weather).toBeUndefined();
  });
});
