import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Synchronize", () => {
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
      .startingLevel(100)
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.SYNCHRONIZE)
      .moveset([MoveId.SPLASH, MoveId.THUNDER_WAVE, MoveId.SPORE, MoveId.PSYCHO_SHIFT])
      .ability(Abilities.NO_GUARD);
  });

  it("does not trigger when no status is applied by opponent Pokemon", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect()).toBe(StatusEffect.NONE);
    expect(game.phaseInterceptor.log).not.toContain("ShowAbilityPhase");
  });

  it("sets the status of the source pokemon to Paralysis when paralyzed by it", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.THUNDER_WAVE);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
    expect(game.field.getEnemyPokemon().getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
    expect(game.phaseInterceptor.log).toContain("ShowAbilityPhase");
  });

  it("does not trigger on Sleep", async () => {
    await game.classicMode.startBattle();

    game.move.select(MoveId.SPORE);

    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(game.field.getEnemyPokemon().getStatusEffect(true)).toBe(StatusEffect.SLEEP);
    expect(game.phaseInterceptor.log).not.toContain("ShowAbilityPhase");
  });

  it("does not trigger when Pokemon is statused by Toxic Spikes", async () => {
    game.override
      .ability(Abilities.SYNCHRONIZE)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Array(4).fill(MoveId.TOXIC_SPIKES));

    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect(true)).toBe(StatusEffect.POISON);
    expect(game.field.getEnemyPokemon().getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(game.phaseInterceptor.log).not.toContain("ShowAbilityPhase");
  });

  it("shows ability even if it fails to set the status of the opponent Pokemon", async () => {
    await game.classicMode.startBattle([Species.PIKACHU]);

    game.move.select(MoveId.THUNDER_WAVE);
    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(game.field.getEnemyPokemon().getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
    expect(game.phaseInterceptor.log).toContain("ShowAbilityPhase");
  });
});
