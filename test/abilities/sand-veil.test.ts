import { type StatMultiplierAbAttr } from "#app/data/abilities/ab-attrs/stat-multiplier-ab-attr";
import { allAbilities } from "#app/data/data-lists";
import { CommandPhase } from "#app/phases/command-phase";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
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
    await game.startBattle([SpeciesId.SNORLAX, SpeciesId.BLISSEY]);

    const leadPokemon = game.scene.getPlayerField();

    game.field.mockAbility(leadPokemon[0], AbilityId.SAND_VEIL);

    const sandVeilAttr = allAbilities[AbilityId.SAND_VEIL].getAttrs<StatMultiplierAbAttr>(
      AbAttrFlag.STAT_MULTIPLIER,
    )[0];
    vi.spyOn(sandVeilAttr, "apply").mockImplementation((_pokemon, _simulated, stat, statValue) => {
      if (stat === Stat.EVA && game.scene.arena.hasWeather(WeatherType.SANDSTORM)) {
        statValue.value *= -1; // will make all attacks miss
        return true;
      }
      return false;
    });

    expect(leadPokemon[0].hasAbility(AbilityId.SAND_VEIL)).toBe(true);
    expect(leadPokemon[1].hasAbility(AbilityId.SAND_VEIL)).toBe(false);

    game.move.select(MoveId.SPLASH);

    await game.phaseInterceptor.to(CommandPhase);

    game.move.select(MoveId.SPLASH, 1);

    await game.phaseInterceptor.to(MoveEffectPhase, false);

    await game.phaseInterceptor.to(MoveEndPhase, false);

    expect(leadPokemon[0].isFullHp()).toBe(true);
    expect(leadPokemon[1].hp).toBeLessThan(leadPokemon[1].getMaxHp());
  });
});
