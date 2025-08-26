import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Swords Dance", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SWORDS_DANCE, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user has a physical attack", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SWORDS_DANCE);
  });

  it("should not be preferred when the user does not have a physical attack", async () => {
    game.override.enemyMoveset([MoveId.SWORDS_DANCE, MoveId.SPLASH, MoveId.WATER_GUN]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SWORDS_DANCE);
  });

  it("should be strongly preferred when the user has Simple", async () => {
    game.override.enemyAbility(AbilityId.SIMPLE);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.SWORDS_DANCE);
  });

  it("should be avoided when the user has Contrary", async () => {
    game.override.enemyAbility(AbilityId.CONTRARY);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.SWORDS_DANCE);
  });
});
