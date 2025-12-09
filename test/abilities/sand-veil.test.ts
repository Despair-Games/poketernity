import { allAbilities } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("Abilities - Sand Veil", () => {
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
    game.override.moveset([MoveId.SPLASH]);
    game.override.enemySpecies(SpeciesId.MEOWSCARADA);
    game.override.enemyAbility(AbilityId.INSOMNIA);
    game.override.enemyMoveset([MoveId.TWISTER, MoveId.TWISTER, MoveId.TWISTER, MoveId.TWISTER]);
    game.override.startingLevel(100);
    game.override.enemyLevel(100);
    game.override.weather(WeatherType.SANDSTORM).battleType("double");
  });

  test("ability should increase the evasiveness of the source", async () => {
    await game.classicMode.startBattle(SpeciesId.SNORLAX, SpeciesId.BLISSEY);

    const leadPokemon = game.scene.getPlayerField();

    game.field.mockAbility(leadPokemon[0], AbilityId.SAND_VEIL);

    const sandVeilAttr = allAbilities[AbilityId.SAND_VEIL].getAttrs("EvasivenessMultiplierAbAttr")[0];
    vi.spyOn(sandVeilAttr, "apply").mockImplementation((_pokemon, _simulated, statValue) => {
      statValue.value = -1;
      return true;
    });

    expect(leadPokemon[0].hasAbility(AbilityId.SAND_VEIL)).toBe(true);
    expect(leadPokemon[1].hasAbility(AbilityId.SAND_VEIL)).toBe(false);

    game.move.select(MoveId.SPLASH);

    await game.phaseInterceptor.to("CommandPhase");

    game.move.select(MoveId.SPLASH, 1);

    await game.phaseInterceptor.to("MoveEffectPhase", false);

    await game.phaseInterceptor.to("PostActionPhase", false);

    expect(leadPokemon[0].isFullHp()).toBe(true);
    expect(leadPokemon[1].hp).toBeLessThan(leadPokemon[1].getMaxHp());
  });
});
