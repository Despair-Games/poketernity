import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Sacrificial Full Restore", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100)
      .startingWave(8); // Forces a Trainer battle with an inactive Pokemon
  });

  const testCases = [
    { moveName: "Healing Wish", moveId: MoveId.HEALING_WISH },
    { moveName: "Lunar Dance", moveId: MoveId.LUNAR_DANCE },
  ];

  describe.each(testCases)("$moveName", ({ moveId }) => {
    beforeEach(async () => {
      game.override.enemyMoveset([moveId, MoveId.SPLASH, MoveId.TACKLE]);
    });

    it("should be avoided when all party pokemon are healthy", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(moveId);
    });

    it("should be preferred when all party pokemon are critically damaged", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      for (const p of game.scene.getEnemyParty()) {
        p.hp = 1;
      }

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(moveId);
    });

    it("should be avoided when the user is a Boss Pokemon", async () => {
      game.override.enemyHealthSegments(2);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      for (const p of game.scene.getEnemyParty()) {
        p.hp = 1;
      }

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(moveId);
    });
  });
});
