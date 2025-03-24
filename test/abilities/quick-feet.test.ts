import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Stat } from "#enums/stat";

describe("Abilities - Quick Feet", () => {
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
      .moveset([MoveId.SPLASH])
      .ability(AbilityId.QUICK_FEET)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should increase the Pokemon's speed by 50% if it has a status effect", async () => {
    game.override.statusEffect(StatusEffect.POISON);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();
    const speedStat = playerPokemon.getStat(Stat.SPD);
    const effectiveSpeedStat = playerPokemon.getEffectiveStat(Stat.SPD);

    expect(effectiveSpeedStat).toBe(Math.floor(speedStat * 1.5));
  });

  it("should ignore Paralysis' speed reduction", async () => {
    game.override.statusEffect(StatusEffect.PARALYSIS);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();
    const speedStat = playerPokemon.getStat(Stat.SPD);
    const effectiveSpeedStat = playerPokemon.getEffectiveStat(Stat.SPD);

    expect(effectiveSpeedStat).toBe(Math.floor(speedStat * 1.5));
  });

  it("should not activate if the Pokemon does not have a status effect", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();
    const speedStat = playerPokemon.getStat(Stat.SPD);
    const effectiveSpeedStat = playerPokemon.getEffectiveStat(Stat.SPD);

    expect(effectiveSpeedStat).toBe(speedStat);
  });

  it("should synergize with Comatose", async () => {
    game.override.passiveAbility(AbilityId.COMATOSE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();
    const speedStat = playerPokemon.getStat(Stat.SPD);
    const effectiveSpeedStat = playerPokemon.getEffectiveStat(Stat.SPD);

    expect(effectiveSpeedStat).toBe(Math.floor(speedStat * 1.5));
  });
});
