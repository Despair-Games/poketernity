import { allMoves } from "#app/data/data-lists";
import { MoveCategory } from "#enums/move-category";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { AiType } from "#enums/ai-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { getEnemyMoveChoices, type MoveChoiceSet } from "./utils/enemy_command_utils";
import type BattleScene from "#app/battle-scene";

let globalScene: BattleScene;

describe("Enemy Commands - Move Selection", () => {
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

  it("should never use Status moves if an attack can KO", async () => {
    game.override
      .enemySpecies(Species.ETERNATUS)
      .enemyMoveset([MoveId.ETERNABEAM, MoveId.SLUDGE_BOMB, MoveId.DRAGON_DANCE, MoveId.COSMIC_POWER])
      .startingLevel(1)
      .enemyLevel(100);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    const moveChoices: MoveChoiceSet = {};
    const enemyMoveset = enemyPokemon.getMoveset();
    enemyMoveset.forEach((mv) => (moveChoices[mv!.moveId] = 0));
    getEnemyMoveChoices(globalScene, enemyPokemon, moveChoices);

    enemyMoveset.forEach((mv) => {
      if (mv?.getMove().category === MoveCategory.STATUS) {
        expect(moveChoices[mv.moveId]).toBe(0);
      }
    });
  });

  it("should not select Last Resort if it would fail, even if the move KOs otherwise", async () => {
    game.override
      .enemySpecies(Species.KANGASKHAN)
      .enemyMoveset([MoveId.LAST_RESORT, MoveId.GIGA_IMPACT, MoveId.SPLASH, MoveId.SWORDS_DANCE])
      .startingLevel(1)
      .enemyLevel(100);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    const moveChoices: MoveChoiceSet = {};
    const enemyMoveset = enemyPokemon.getMoveset();
    enemyMoveset.forEach((mv) => (moveChoices[mv!.moveId] = 0));
    getEnemyMoveChoices(globalScene, enemyPokemon, moveChoices);

    enemyMoveset.forEach((mv) => {
      if (mv?.getMove().category === MoveCategory.STATUS || mv?.moveId === MoveId.LAST_RESORT) {
        expect(moveChoices[mv.moveId]).toBe(0);
      }
    });
  });

  it("should avoid attacks that have no effect on the target", async () => {
    game.override
      .enemySpecies(Species.SNORLAX)
      .enemyMoveset([MoveId.COVET, MoveId.THIEF, MoveId.FLAME_WHEEL, MoveId.SPLASH])
      .startingLevel(100)
      .enemyLevel(100);

    await game.classicMode.startBattle([Species.DUSKULL]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    const moveChoices: MoveChoiceSet = {};
    const enemyMoveset = enemyPokemon.getMoveset();
    enemyMoveset.forEach((mv) => (moveChoices[mv.moveId] = 0));
    getEnemyMoveChoices(globalScene, enemyPokemon, moveChoices);

    expect(moveChoices[MoveId.SPLASH]).toBe(0);
    expect(moveChoices[MoveId.COVET]).toBe(0);
  });

  it("should not crash from an off-field enemy Pokemon simulating every move", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const offFieldEnemy = game.scene.getEnemyParty()[1];

    for (const move of Object.values(allMoves)) {
      const eas = offFieldEnemy.getExpectedAttackScore(player, move);
      expect(eas).toBeGreaterThanOrEqual(-1);
      expect(eas).toBeLessThanOrEqual(6);
      const eas2 = player.getExpectedAttackScore(offFieldEnemy, move);
      expect(eas2).toBeGreaterThanOrEqual(-1);
      expect(eas2).toBeLessThanOrEqual(6);
    }
  });
});
