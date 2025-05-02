import type BattleScene from "#app/battle-scene";
import { AbilityId } from "#enums/ability-id";
import { AiType } from "#enums/ai-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { getEnemyMoveChoices } from "#test/ai/utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/gameManager";
import { describe, beforeAll, afterEach, beforeEach, it, expect } from "vitest";

let globalScene: BattleScene;

describe("Enemy Commands - Low Accuracy", () => {
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
    globalScene = game.scene;

    game.override.ability(AbilityId.BALL_FETCH).enemyAbility(AbilityId.BALL_FETCH);
  });

  it("AI should prefer accurate moves over inaccurate", async () => {
    game.override.enemySpecies(SpeciesId.ETERNATUS).enemyMoveset([MoveId.HYPNOSIS, MoveId.SLEEP_POWDER, MoveId.SPORE]);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemyPokemon = game.field.getEnemyPokemon();
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    const moveChoices = getEnemyMoveChoices(globalScene, enemyPokemon);

    enemyPokemon.getMoveset().forEach((mv) => {
      if (mv.moveId !== MoveId.SPORE) {
        expect(moveChoices[mv.moveId]).toBe(0);
      }
    });
  });
});
