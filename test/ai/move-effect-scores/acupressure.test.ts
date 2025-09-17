import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Acupressure", () => {
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

  const baseMoveset: MoveId[] = [MoveId.ACUPRESSURE, MoveId.SPLASH, MoveId.TACKLE];

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset(baseMoveset)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over moves with low impact", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.ACUPRESSURE);
  });

  it("should not be preferred over Swords Dance when Attack is relevant", async () => {
    game.override.enemyMoveset([...baseMoveset, MoveId.SWORDS_DANCE]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SWORDS_DANCE);
  });

  it("should be avoided when the user has Contrary", async () => {
    game.override.enemyAbility(AbilityId.CONTRARY);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.ACUPRESSURE);
  });

  it("should be preferred over Swords Dance when targeting the user's ally", async () => {
    game.override.battleType("double").enemyMoveset([...baseMoveset, MoveId.SWORDS_DANCE]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toPreferSelectingMove(MoveId.ACUPRESSURE);
  });
});
