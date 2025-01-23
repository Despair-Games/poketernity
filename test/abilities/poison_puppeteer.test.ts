import { TUTORIAL_BATTLE_WAVE } from "#app/data/special-waves";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Poison Puppeteer", () => {
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
      .ability(Abilities.POISON_PUPPETEER)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyLevel(100)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should confuse the target if the user poisons the target directly", async () => {
    await game.classicMode.startBattle([Species.MAREANIE]);

    game.move.use(Moves.MORTAL_SPIN);
    await game.phaseInterceptor.to("BerryPhase");

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.status?.effect).toBe(StatusEffect.POISON);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });

  it("should confuse the target if the user badly poisons the target directly", async () => {
    await game.classicMode.startBattle([Species.MAREANIE]);

    game.move.use(Moves.TOXIC);
    await game.phaseInterceptor.to("BerryPhase");

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.status?.effect).toBe(StatusEffect.TOXIC);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });

  it("should not confuse the target if the user poisons the target via Toxic Spikes", async () => {
    game.override.startingWave(TUTORIAL_BATTLE_WAVE);
    await game.classicMode.startBattle([Species.MAREANIE]);

    game.move.use(Moves.TOXIC_SPIKES);
    await game.toNextTurn();

    game.move.use(Moves.SPLASH);
    await game.forceEnemyToSwitch();
    await game.phaseInterceptor.to("BerryPhase");

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.status?.effect).toBe(StatusEffect.POISON);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeUndefined();
  });

  it("should not confuse the target if the user paralyzes the target", async () => {
    await game.classicMode.startBattle([Species.MAREANIE]);

    game.move.use(Moves.NUZZLE);
    await game.phaseInterceptor.to("BerryPhase");

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.status?.effect).toBe(StatusEffect.PARALYSIS);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeUndefined();
  });
});
