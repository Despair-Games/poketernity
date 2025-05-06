import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { AiType } from "#enums/ai-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Enemy Commands - Basic Move Selection", () => {
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

  it("should never use Status moves if an attack can KO", async () => {
    game.override
      .enemySpecies(SpeciesId.ETERNATUS)
      .enemyMoveset([MoveId.ETERNABEAM, MoveId.SLUDGE_BOMB, MoveId.DRAGON_DANCE, MoveId.COSMIC_POWER])
      .startingLevel(1)
      .enemyLevel(100);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    expect(enemyPokemon).toNeverSelectMove((move) => move.isStatusMove());
  });

  it("should not select Last Resort if it would fail, even if the move KOs otherwise", async () => {
    game.override
      .enemySpecies(SpeciesId.KANGASKHAN)
      .enemyMoveset([MoveId.LAST_RESORT, MoveId.GIGA_IMPACT, MoveId.SPLASH, MoveId.SWORDS_DANCE])
      .startingLevel(1)
      .enemyLevel(100);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    expect(enemyPokemon).toNeverSelectMove([MoveId.LAST_RESORT, MoveId.SPLASH, MoveId.SWORDS_DANCE]);
  });

  it("should avoid attacks that have no effect on the target", async () => {
    game.override
      .enemySpecies(SpeciesId.SNORLAX)
      .enemyMoveset([MoveId.COVET, MoveId.THIEF, MoveId.FLAME_WHEEL, MoveId.SPLASH])
      .startingLevel(100)
      .enemyLevel(100);

    await game.classicMode.startBattle([SpeciesId.DUSKULL]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.aiType = AiType.SMART_RANDOM;

    expect(enemyPokemon).toNeverSelectMove([MoveId.SPLASH, MoveId.COVET]);
  });

  it("should not crash from an off-field enemy Pokemon simulating every move", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

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
