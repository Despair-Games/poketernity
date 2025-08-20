import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Heal Bell", () => {
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
      .startingWave(8) // Forces a Trainer battle w/ 2 Pokemon
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.HEAL_BELL, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be avoided when none of the user's party are afflicted with a status", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.HEAL_BELL);
  });

  it("should be strongly preferred when the user and a party member are afflicted with a status", async () => {
    game.override.enemyStatusEffect(StatusEffect.BURN);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.HEAL_BELL);
  });

  it("should not count active allies with Soundproof towards effect score", async () => {
    game.override
      .battleType("double")
      .enemyAbility(AbilityId.SOUNDPROOF)
      .enemyStatusEffect(StatusEffect.BURN)
      .startingWave(1);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const [enemy] = game.scene.getEnemyField();
    // Heal Bell should have exactly (+1) ES
    expect(enemy).toPreferSelectingMove(MoveId.HEAL_BELL);
    // Tackle's ES is in the interval [0, 1], so it should still be used sometimes
    expect(enemy).not.toNeverSelectMove(MoveId.TACKLE);
  });
});
