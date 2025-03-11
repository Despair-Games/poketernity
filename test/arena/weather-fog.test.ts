import { allMoves } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { FOG_ACCURACY_MULTIPLIER } from "#app/constants";

describe("Weather - Fog", () => {
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
      .weather(WeatherType.FOG)
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([MoveId.SPLASH])
      .moveset([MoveId.TACKLE]);
  });

  it("move accuracy is changed in fog", async () => {
    const moveToCheck = allMoves.get(MoveId.TACKLE);

    vi.spyOn(moveToCheck, "calculateBattleAccuracy");

    await game.classicMode.startBattle([Species.FEEBAS]);
    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to(MoveEffectPhase);

    expect(moveToCheck.calculateBattleAccuracy).toHaveReturnedWith(100 * FOG_ACCURACY_MULTIPLIER);
  });

  it("move accuracy is unaffected if fog is suppressed", async () => {
    const moveToCheck = allMoves.get(MoveId.TACKLE);

    vi.spyOn(moveToCheck, "calculateBattleAccuracy");
    game.override.ability(Abilities.AIR_LOCK);
    await game.classicMode.startBattle([Species.FEEBAS]);
    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to(MoveEffectPhase);

    expect(moveToCheck.calculateBattleAccuracy).toHaveReturnedWith(100);
  });
});
