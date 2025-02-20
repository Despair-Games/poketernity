import { Abilities } from "#enums/abilities";
import { Stat } from "#enums/stat";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { toDmgValue } from "#app/utils";

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
    game.override
      .battleType("single")
      .moveset(MoveId.SPLASH)
      .enemyMoveset(MoveId.SANDSTORM)
      .enemySpecies(Species.MAGIKARP);
  });

  it("inflicts damage equal to 1/16 of Pokemon's max HP at turn end", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.select(MoveId.SPLASH);

    await game.toEndOfTurn();

    game.scene.getField(true).forEach((pokemon) => {
      expect(pokemon.hp).toBe(pokemon.getMaxHp() - toDmgValue(pokemon.getMaxHp() / 16));
    });
  });

  it("should not inflict damage on the turn that the weather expires", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    // Turn 5: Sandstorm should expire and deal no damage this turn
    const player = game.field.getPlayerPokemon();
    const initialHp = player.hp;
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    expect(game.scene.arena.weather).toBeFalsy();
    expect(player.hp).toBe(initialHp);
  });

  it("does not inflict damage to a Pokemon that is underwater (Dive) or underground (Dig)", async () => {
    game.override.moveset([MoveId.DIVE]);
    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.select(MoveId.DIVE);

    await game.toEndOfTurn();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    expect(playerPokemon.hp).toBe(playerPokemon.getMaxHp());
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp() - Math.max(Math.floor(enemyPokemon.getMaxHp() / 16), 1));
  });

  it("does not inflict damage to Rock, Ground and Steel type Pokemon", async () => {
    game.override
      .battleType("double")
      .enemySpecies(Species.SANDSHREW)
      .ability(Abilities.BALL_FETCH)
      .enemyAbility(Abilities.BALL_FETCH);

    await game.classicMode.startBattle([Species.ROCKRUFF, Species.KLINK]);

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    game.scene.getField(true).forEach((pokemon) => {
      expect(pokemon.hp).toBe(pokemon.getMaxHp());
    });
  });

  it("increases Rock type Pokemon Sp.Def by 50%", async () => {
    await game.classicMode.startBattle([Species.ROCKRUFF]);

    // Stall 1 turn to let opponent use Sandstorm
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const playerSpdef = playerPokemon.getStat(Stat.SPDEF);
    expect(playerPokemon.getEffectiveStat(Stat.SPDEF)).toBe(Math.floor(playerSpdef * 1.5));

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const enemySpdef = enemyPokemon.getStat(Stat.SPDEF);
    expect(enemyPokemon.getEffectiveStat(Stat.SPDEF)).toBe(enemySpdef);
  });
});
