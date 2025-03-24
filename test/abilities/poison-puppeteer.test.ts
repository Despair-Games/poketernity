import { TUTORIAL_BATTLE_WAVE } from "#app/data/special-waves";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
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
      .ability(AbilityId.POISON_PUPPETEER)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyLevel(100)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should confuse the target if the user poisons the target directly", async () => {
    await game.classicMode.startBattle([SpeciesId.MAREANIE]);

    game.move.use(MoveId.MORTAL_SPIN);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.POISON);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });

  it("should confuse the target if the user badly poisons the target directly", async () => {
    await game.classicMode.startBattle([SpeciesId.MAREANIE]);

    game.move.use(MoveId.TOXIC);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.TOXIC);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });

  it("should not confuse the target if the user poisons the target via Toxic Spikes", async () => {
    game.override.startingWave(TUTORIAL_BATTLE_WAVE);
    await game.classicMode.startBattle([SpeciesId.MAREANIE]);

    game.move.use(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();

    game.move.use(MoveId.SPLASH);
    await game.forceEnemyToSwitch();
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.POISON);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeUndefined();
  });

  it("should not confuse the target if the user paralyzes the target", async () => {
    await game.classicMode.startBattle([SpeciesId.MAREANIE]);

    game.move.use(MoveId.NUZZLE);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
    expect(enemyPokemon.getTag(BattlerTagType.CONFUSED)).toBeUndefined();
  });
});
