import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import { describe, beforeAll, afterEach, beforeEach, it, expect } from "vitest";

describe("Enemy Commands - Priority", () => {
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
    game.override.ability(AbilityId.BALL_FETCH).enemyAbility(AbilityId.BALL_FETCH);
  });

  it("AI should always select priority moves if they KO", async () => {
    game.override
      .enemySpecies(SpeciesId.ETERNATUS)
      .enemyMoveset([MoveId.FLAMETHROWER, MoveId.QUICK_ATTACK, MoveId.ETERNABEAM, MoveId.SWORDS_DANCE])
      .enemyLevel(100)
      .startingLevel(1);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemyPokemon = game.field.getEnemyPokemon();

    expect(enemyPokemon).toNeverSelectMove((move) => move.id !== MoveId.QUICK_ATTACK);
  });
});
