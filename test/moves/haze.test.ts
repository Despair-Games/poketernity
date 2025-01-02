import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { TurnInitPhase } from "#app/phases/turn-init-phase";

describe("Moves - Haze", () => {
  describe("integration tests", () => {
    let phaserGame: Phaser.Game;
    let game: GameManager;

    beforeAll(() => {
      phaserGame = new Phaser.Game({ type: Phaser.HEADLESS });
    });

    afterEach(() => {
      game.phaseInterceptor.restoreOg();
    });

    beforeEach(() => {
      game = new GameManager(phaserGame);

      game.overridesHelper.battleType("single");

      game.overridesHelper.enemySpecies(Species.RATTATA);
      game.overridesHelper.enemyLevel(100);
      game.overridesHelper.enemyMoveset(Moves.SPLASH);
      game.overridesHelper.enemyAbility(Abilities.NONE);

      game.overridesHelper.startingLevel(100);
      game.overridesHelper.moveset([Moves.HAZE, Moves.SWORDS_DANCE, Moves.CHARM, Moves.SPLASH]);
      game.overridesHelper.ability(Abilities.NONE);
    });

    it("should reset all stat changes of all Pokemon on field", async () => {
      await game.startBattle([Species.RATTATA]);
      const user = game.scene.getPlayerPokemon()!;
      const enemy = game.scene.getEnemyPokemon()!;

      expect(user.getStatStage(Stat.ATK)).toBe(0);
      expect(enemy.getStatStage(Stat.ATK)).toBe(0);

      game.move.select(Moves.SWORDS_DANCE);
      await game.phaseInterceptor.to(TurnInitPhase);

      game.move.select(Moves.CHARM);
      await game.phaseInterceptor.to(TurnInitPhase);

      expect(user.getStatStage(Stat.ATK)).toBe(2);
      expect(enemy.getStatStage(Stat.ATK)).toBe(-2);

      game.move.select(Moves.HAZE);
      await game.phaseInterceptor.to(TurnInitPhase);

      expect(user.getStatStage(Stat.ATK)).toBe(0);
      expect(enemy.getStatStage(Stat.ATK)).toBe(0);
    });
  });
});
