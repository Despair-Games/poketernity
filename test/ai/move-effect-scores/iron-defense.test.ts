import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Iron Defense", () => {
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
      .enemyMoveset([MoveId.IRON_DEFENSE, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the opponent is a physical attacker", async () => {
    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.IRON_DEFENSE);
  });

  it("should not be preferred when the opponent is a special attacker", async () => {
    await game.classicMode.startBattle(SpeciesId.SOBBLE);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.IRON_DEFENSE);
  });

  it("should be strongly preferred when the user has Simple", async () => {
    game.override.enemyAbility(AbilityId.SIMPLE);

    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.IRON_DEFENSE);
  });

  it("should be avoided when the user has Contrary", async () => {
    game.override.enemyAbility(AbilityId.CONTRARY);

    await game.classicMode.startBattle(SpeciesId.DRILBUR);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.IRON_DEFENSE);
  });

  it("should be preferred when the user knows Body Press", async () => {
    game.override.enemyMoveset([MoveId.IRON_DEFENSE, MoveId.BODY_PRESS, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.MAGCARGO);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.IRON_DEFENSE);
  });
});
