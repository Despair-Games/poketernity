import type BattleScene from "#app/battle-scene";
import { Abilities } from "#enums/abilities";
import { AiType } from "#enums/ai-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import { describe, beforeAll, afterEach, beforeEach, it, expect } from "vitest";
import { type MoveChoiceSet, getEnemyMoveChoices } from "./utils/enemy_command_utils";

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

    game.override.ability(Abilities.BALL_FETCH).enemyAbility(Abilities.BALL_FETCH);
  });

  it("AI should prefer accurate moves over inaccurate", async () => {
    game.override.enemySpecies(Species.ETERNATUS).enemyMoveset([MoveId.HYPNOSIS, MoveId.SLEEP_POWDER, MoveId.SPORE]);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.field.getEnemyPokemon();
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    const moveChoices: MoveChoiceSet = {};
    const enemyMoveset = enemyPokemon.getMoveset();
    enemyMoveset.forEach((mv) => (moveChoices[mv.moveId] = 0));
    getEnemyMoveChoices(globalScene, enemyPokemon, moveChoices);

    enemyMoveset.forEach((mv) => {
      if (mv.moveId !== MoveId.SPORE) {
        expect(moveChoices[mv.moveId]).toBe(0);
      }
    });
  });
});
