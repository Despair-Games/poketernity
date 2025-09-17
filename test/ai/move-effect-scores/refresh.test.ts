import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Refresh", () => {
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
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.REFRESH, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be avoided when the user does not have a status effect", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.REFRESH);
  });

  it.each([
    ["poisoned", StatusEffect.POISON],
    ["badly poisoned", StatusEffect.TOXIC],
    ["paralyzed", StatusEffect.PARALYSIS],
    ["burned", StatusEffect.BURN],
  ])("should be preferred when the user is %s", async (_, effect) => {
    game.override.enemyStatusEffect(effect);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.REFRESH);
  });

  it.each([
    ["asleep", StatusEffect.SLEEP],
    ["frozen", StatusEffect.FREEZE],
  ])("should be avoided when the user is %s", async (_, effect) => {
    game.override.enemyStatusEffect(effect);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.REFRESH);
  });

  it("should be avoided when the user is burned, but has Guts", async () => {
    game.override.enemyStatusEffect(StatusEffect.BURN).enemyAbility(AbilityId.GUTS);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.REFRESH);
  });
});
