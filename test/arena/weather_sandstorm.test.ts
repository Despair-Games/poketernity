import { Abilities } from "#enums/abilities";
import { Stat } from "#enums/stat";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Weather - Sandstorm", () => {
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
      .weather(WeatherType.SANDSTORM)
      .battleType("single")
      .moveset(Moves.SPLASH)
      .enemyMoveset(Moves.SPLASH)
      .enemySpecies(Species.MAGIKARP);
  });

  it("inflicts damage equal to 1/16 of Pokemon's max HP at turn end", async () => {
    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.SPLASH);

    await game.phaseInterceptor.to("TurnEndPhase");

    game.scene.getField(true).forEach((pokemon) => {
      expect(pokemon.hp).toBe(pokemon.getMaxHp() - Math.max(Math.floor(pokemon.getMaxHp() / 16), 1));
    });
  });

  it("does not inflict damage to a Pokemon that is underwater (Dive) or underground (Dig)", async () => {
    game.overridesHelper.moveset([Moves.DIVE]);
    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    game.moveHelper.select(Moves.DIVE);

    await game.phaseInterceptor.to("TurnEndPhase");

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    expect(playerPokemon.hp).toBe(playerPokemon.getMaxHp());
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp() - Math.max(Math.floor(enemyPokemon.getMaxHp() / 16), 1));
  });

  it("does not inflict damage to Rock, Ground and Steel type Pokemon", async () => {
    game.overridesHelper
      .battleType("double")
      .enemySpecies(Species.SANDSHREW)
      .ability(Abilities.BALL_FETCH)
      .enemyAbility(Abilities.BALL_FETCH);

    await game.classicModeHelper.startBattle([Species.ROCKRUFF, Species.KLINK]);

    game.moveHelper.select(Moves.SPLASH, 0);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("TurnEndPhase");

    game.scene.getField(true).forEach((pokemon) => {
      expect(pokemon.hp).toBe(pokemon.getMaxHp());
    });
  });

  it("increases Rock type Pokemon Sp.Def by 50%", async () => {
    await game.classicModeHelper.startBattle([Species.ROCKRUFF]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const playerSpdef = playerPokemon.getStat(Stat.SPDEF);
    expect(playerPokemon.getEffectiveStat(Stat.SPDEF)).toBe(Math.floor(playerSpdef * 1.5));

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const enemySpdef = enemyPokemon.getStat(Stat.SPDEF);
    expect(enemyPokemon.getEffectiveStat(Stat.SPDEF)).toBe(enemySpdef);
  });
});
