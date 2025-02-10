import { allAbilities } from "#app/data/all-abilities";
import { type StatMultiplierAbAttr } from "#app/data/ab-attrs/stat-multiplier-ab-attr";
import { CommandPhase } from "#app/phases/command-phase";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { AbAttrFlag } from "#enums/ab-attr-flag";

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
    game.override.enemySpecies(Species.MEOWSCARADA);
    game.override.enemyAbility(Abilities.INSOMNIA);
    game.override.enemyMoveset([MoveId.TWISTER, MoveId.TWISTER, MoveId.TWISTER, MoveId.TWISTER]);
    game.override.startingLevel(100);
    game.override.enemyLevel(100);
    game.override.weather(WeatherType.SANDSTORM).battleType("double");
  });

  test("ability should increase the evasiveness of the source", async () => {
    await game.startBattle([Species.SNORLAX, Species.BLISSEY]);

    const leadPokemon = game.scene.getPlayerField();

    vi.spyOn(leadPokemon[0], "getAbility").mockReturnValue(allAbilities[Abilities.SAND_VEIL]);

    const sandVeilAttr = allAbilities[Abilities.SAND_VEIL].getAttrs<StatMultiplierAbAttr>(
      AbAttrFlag.STAT_MULTIPLIER,
    )[0];
    vi.spyOn(sandVeilAttr, "apply").mockImplementation((_pokemon, _simulated, stat, statValue) => {
      if (stat === Stat.EVA && game.scene.arena.weather?.weatherType === WeatherType.SANDSTORM) {
        statValue.value *= -1; // will make all attacks miss
        return true;
      }
      return false;
    });

    expect(leadPokemon[0].hasAbility(Abilities.SAND_VEIL)).toBe(true);
    expect(leadPokemon[1].hasAbility(Abilities.SAND_VEIL)).toBe(false);

    game.move.select(MoveId.SPLASH);

    await game.phaseInterceptor.to(CommandPhase);

    game.move.select(MoveId.SPLASH, 1);

    await game.phaseInterceptor.to(MoveEffectPhase, false);

    await game.phaseInterceptor.to(MoveEndPhase, false);

    expect(leadPokemon[0].isFullHp()).toBe(true);
    expect(leadPokemon[1].hp).toBeLessThan(leadPokemon[1].getMaxHp());
  });
});
