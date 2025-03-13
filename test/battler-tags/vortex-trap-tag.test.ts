import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GameManager } from "#test/test-utils/gameManager";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { toDmgValue } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";

describe("BattlerTag - VortexTrapTag", () => {
  describe("lapse behavior", () => {
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
        .battleType("double")
        .startingLevel(1)
        .moveset([MoveId.FIRE_SPIN, MoveId.G_MAX_CENTIFERNO, MoveId.MEMENTO, MoveId.SPLASH])
        .ability(Abilities.NO_GUARD)
        .enemySpecies(Species.SHUCKLE)
        .enemyLevel(100)
        .enemyAbility(Abilities.BALL_FETCH)
        .enemyMoveset(MoveId.SPLASH);
    });

    it("Fire spin should trap and damage a single target until the user leaves", async () => {
      await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

      game.move.select(MoveId.FIRE_SPIN, 0, BattlerIndex.ENEMY);
      game.move.select(MoveId.SPLASH, 1);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      await game.phaseInterceptor.to("MoveEndPhase", false);

      const enemyParty = game.scene.getEnemyParty();
      const enemy0 = enemyParty[0];
      const enemy1 = enemyParty[1];

      const enemy0StartingHp = enemy0.hp;
      const enemy1StartingHp = enemy1.hp;
      await game.toNextTurn();

      expect(enemy0.getTag(BattlerTagType.FIRE_SPIN)).toBeDefined();
      expect(enemy1.getTag(BattlerTagType.FIRE_SPIN)).toBeUndefined();
      expect(enemy0.isTrapped()).toBe(true);
      expect(enemy1.isTrapped()).toBe(false);

      const enemy0turnTwoHp = enemy0.hp;
      const enemy1turnTwoHp = enemy1.hp;
      expect(enemy0StartingHp - enemy0turnTwoHp).toBe(toDmgValue(enemy0.getMaxHp() / 8));
      expect(enemy1StartingHp - enemy1turnTwoHp).toBe(0);

      game.move.select(MoveId.MEMENTO, 0, BattlerIndex.ENEMY);
      game.move.select(MoveId.SPLASH, 1);
      await game.toNextTurn();

      expect(enemy0.getTag(BattlerTagType.FIRE_SPIN)).toBeUndefined();
      expect(enemy1.getTag(BattlerTagType.FIRE_SPIN)).toBeUndefined();
      expect(enemy0.isTrapped()).toBe(false);
      expect(enemy1.isTrapped()).toBe(false);

      const enemy0turnThreeHp = enemy0.hp;
      const enemy1turnThreeHp = enemy1.hp;
      expect(enemy0turnTwoHp - enemy0turnThreeHp).toBe(0);
      expect(enemy1turnTwoHp - enemy1turnThreeHp).toBe(0);
    });

    it("Fire spin cannot trap ghost types but still damages them", async () => {
      game.override.enemySpecies(Species.GENGAR);
      await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

      game.move.select(MoveId.FIRE_SPIN, 0, BattlerIndex.ENEMY);
      game.move.select(MoveId.SPLASH, 1);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      await game.phaseInterceptor.to("MoveEndPhase", false);

      const enemyParty = game.scene.getEnemyParty();
      const enemy0 = enemyParty[0];
      const enemy1 = enemyParty[1];

      const enemy0StartingHp = enemy0.hp;
      const enemy1StartingHp = enemy1.hp;
      await game.toNextTurn();

      expect(enemy0.getTag(BattlerTagType.FIRE_SPIN)).toBeDefined();
      expect(enemy1.getTag(BattlerTagType.FIRE_SPIN)).toBeUndefined();
      expect(enemy0.isTrapped()).toBe(false);
      expect(enemy1.isTrapped()).toBe(false);

      const enemy0turnTwoHp = enemy0.hp;
      const enemy1turnTwoHp = enemy1.hp;
      expect(enemy0StartingHp - enemy0turnTwoHp).toBe(toDmgValue(enemy0.getMaxHp() / 8));
      expect(enemy1StartingHp - enemy1turnTwoHp).toBe(0);
    });

    it("Fire spin cannot damage magic guard but still traps them", async () => {
      game.override.enemyAbility(Abilities.MAGIC_GUARD);
      await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

      game.move.select(MoveId.FIRE_SPIN, 0, BattlerIndex.ENEMY);
      game.move.select(MoveId.SPLASH, 1);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      await game.phaseInterceptor.to("MoveEndPhase", false);

      const enemyParty = game.scene.getEnemyParty();
      const enemy0 = enemyParty[0];
      const enemy1 = enemyParty[1];

      const enemy0StartingHp = enemy0.hp;
      const enemy1StartingHp = enemy1.hp;
      await game.toNextTurn();

      expect(enemy0.getTag(BattlerTagType.FIRE_SPIN)).toBeDefined();
      expect(enemy1.getTag(BattlerTagType.FIRE_SPIN)).toBeUndefined();
      expect(enemy0.isTrapped()).toBe(true);
      expect(enemy1.isTrapped()).toBe(false);

      const enemy0turnTwoHp = enemy0.hp;
      const enemy1turnTwoHp = enemy1.hp;
      expect(enemy0StartingHp - enemy0turnTwoHp).toBe(0);
      expect(enemy1StartingHp - enemy1turnTwoHp).toBe(0);
    });

    it("G-Max centiferno affects both enemies and even after user leaves", async () => {
      await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

      game.move.select(MoveId.G_MAX_CENTIFERNO, 0, BattlerIndex.ENEMY);
      game.move.select(MoveId.SPLASH, 1);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      await game.phaseInterceptor.to("MoveEndPhase", false);

      const enemyParty = game.scene.getEnemyParty();
      const enemy0 = enemyParty[0];
      const enemy1 = enemyParty[1];

      const enemy0StartingHp = enemy0.hp;
      const enemy1StartingHp = enemy1.hp;
      await game.toNextTurn();

      expect(enemy0.getTag(BattlerTagType.G_MAX_FIRE_SPIN)).toBeDefined();
      expect(enemy1.getTag(BattlerTagType.G_MAX_FIRE_SPIN)).toBeDefined();
      expect(enemy0.isTrapped()).toBe(true);
      expect(enemy1.isTrapped()).toBe(true);

      const enemy0turnTwoHp = enemy0.hp;
      const enemy1turnTwoHp = enemy1.hp;
      expect(enemy0StartingHp - enemy0turnTwoHp).toBe(toDmgValue(enemy0.getMaxHp() / 8));
      expect(enemy1StartingHp - enemy1turnTwoHp).toBe(toDmgValue(enemy1.getMaxHp() / 8));

      game.move.select(MoveId.MEMENTO, 0, BattlerIndex.ENEMY);
      game.move.select(MoveId.SPLASH, 1);
      await game.toNextTurn();

      expect(enemy0.getTag(BattlerTagType.G_MAX_FIRE_SPIN)).toBeDefined();
      expect(enemy1.getTag(BattlerTagType.G_MAX_FIRE_SPIN)).toBeDefined();
      expect(enemy0.isTrapped()).toBe(true);
      expect(enemy1.isTrapped()).toBe(true);

      const enemy0turnThreeHp = enemy0.hp;
      const enemy1turnThreeHp = enemy1.hp;
      expect(enemy0turnTwoHp - enemy0turnThreeHp).toBe(toDmgValue(enemy0.getMaxHp() / 8));
      expect(enemy1turnTwoHp - enemy1turnThreeHp).toBe(toDmgValue(enemy1.getMaxHp() / 8));
    });
  });
});
