import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Move - Pursuit", () => {
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
      .enemyTeraType(ElementalType.DARK)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.PURSUIT)
      .startingLevel(100)
      .enemyLevel(100);
  });

  describe("in Single Battles", () => {
    beforeEach(() => {
      game.override //
        .battleType("single")
        .enemyMoveset(MoveId.PURSUIT);
    });

    it("should attack at 40 power in normal turn order when no opponents switch out", async () => {
      const pursuit = allMoves.get(MoveId.PURSUIT);
      vi.spyOn(pursuit, "calculateBattlePower");

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
      game.move.use(MoveId.SPLASH);
      await game.toEndOfTurn();

      expect(pursuit.calculateBattlePower).toHaveLastReturnedWith(40);
    });

    it("should attack a retreating opponent before they switch out at 80 power", async () => {
      const pursuit = allMoves.get(MoveId.PURSUIT);
      vi.spyOn(pursuit, "calculateBattlePower");

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      const [magikarp, feebas] = game.scene.getPlayerParty();
      game.switchPokemon(1);
      await game.toEndOfTurn();

      expect(pursuit.calculateBattlePower).toHaveLastReturnedWith(80);
      expect(magikarp).not.toHaveFullHp();
      expect(feebas).toHaveFullHp();
    });

    it("should attack a retreating opponent before they switch out via U-turn", async () => {
      const pursuit = allMoves.get(MoveId.PURSUIT);
      vi.spyOn(pursuit, "calculateBattlePower");

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      const [magikarp, feebas] = game.scene.getPlayerParty();

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
      game.move.use(MoveId.U_TURN);
      game.selectPartyPokemon(1);
      await game.toEndOfTurn();

      expect(pursuit.calculateBattlePower).toHaveLastReturnedWith(80);
      expect(magikarp).not.toHaveFullHp();
      expect(feebas).toHaveFullHp();
    });

    it("should not attack a retreating opponent before they switch out via Baton Pass", async () => {
      const pursuit = allMoves.get(MoveId.PURSUIT);
      vi.spyOn(pursuit, "calculateBattlePower");

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      const [magikarp, feebas] = game.scene.getPlayerParty();

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
      game.move.use(MoveId.BATON_PASS);
      game.selectPartyPokemon(1);
      await game.toEndOfTurn();

      expect(pursuit.calculateBattlePower).toHaveLastReturnedWith(40);
      expect(magikarp).toHaveFullHp();
      expect(feebas).not.toHaveFullHp();
    });

    it("should allow the user to Terastallize before attacking a retreating opponent", async () => {
      game.override.forceEnemyTera();

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      const enemy = game.field.getEnemyPokemon();
      const magikarp = game.field.getPlayerPokemon();

      game.switchPokemon(1);
      await game.phaseInterceptor.to("MoveEffectPhase", false);

      expect(enemy.isTerastallized).toBe(true);
      expect(magikarp.isActive(true)).toBe(true);
    });

    it("should bypass accuracy checks when attacking a retreating opponent", async () => {
      const pursuit = allMoves.get(MoveId.PURSUIT);
      vi.spyOn(pursuit, "accuracy", "get").mockReturnValue(0);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      const enemy = game.field.getEnemyPokemon();
      const magikarp = game.field.getPlayerPokemon();

      game.switchPokemon(1);
      await game.toEndOfTurn();

      expect(magikarp).not.toHaveFullHp();
      expect(enemy).toHaveMoveResult(MoveResult.SUCCESS);
    });
  });

  describe("in Double Battles", () => {
    beforeEach(() => {
      game.override //
        .battleType("double")
        .enemyMoveset(MoveId.SPLASH);
    });

    it("should attack a retreating opponent even if the original target was another Pokemon", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS, SpeciesId.LUVDISC);

      const [magikarp, feebas, luvdisc] = game.scene.getPlayerParty();
      game.move.use(MoveId.SPLASH, 0);
      game.switchPokemon(2);
      await game.move.forceEnemyMove(MoveId.PURSUIT, BattlerIndex.PLAYER);
      await game.toNextTurn();

      expect(magikarp).toHaveFullHp();
      expect(feebas).not.toHaveFullHp();
      expect(luvdisc).toHaveFullHp();
    });

    it("should not attack retreating allies", async () => {
      const pursuit = allMoves.get(MoveId.PURSUIT);
      vi.spyOn(pursuit, "calculateBattlePower");

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS, SpeciesId.LUVDISC);

      const [enemy1] = game.scene.getEnemyField();

      game.move.use(MoveId.PURSUIT, 0, BattlerIndex.ENEMY);
      game.switchPokemon(2);
      await game.toEndOfTurn();

      expect(pursuit.calculateBattlePower).toHaveLastReturnedWith(40);
      expect(enemy1).not.toHaveFullHp();
      game.scene.getPlayerParty().forEach((p) => expect(p).toHaveFullHp());
    });

    // TODO: turn order utils seem to be interfering with this test
    it.todo("should attack in turn order when used by multiple allies against the same target", async () => {
      game.override.enemyMoveset(MoveId.PURSUIT);

      const pursuit = allMoves.get(MoveId.PURSUIT);
      const pursuitSpy = vi.spyOn(pursuit, "calculateBattlePower");

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS, SpeciesId.LUVDISC);

      const [magikarp] = game.scene.getPlayerField();

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY_2, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2]);
      game.switchPokemon(2);
      game.move.use(MoveId.SPLASH, 1);
      await game.toNextTurn();

      /*
       * Note: Under Pursuit's current implementation, switch commands are still scheduled first, but may be
       * interrupted by opponents' uses of Pursuit. Since turn order reflects when commands are scheduled, the
       * `PLAYER` Pokemon is expected to act first.
       */
      expect(game.field.getTurnOrder()).toEqual([
        BattlerIndex.PLAYER,
        BattlerIndex.ENEMY_2,
        BattlerIndex.ENEMY,
        BattlerIndex.PLAYER_2,
      ]);
      expect(magikarp.turnData.attacksReceived).toHaveLength(2);

      const pursuitPower = pursuitSpy.mock.results.map((result) => result.value);
      expect(pursuitPower).toHaveLength(2);
      pursuitPower.forEach((power) => expect(power).toBe(80));
    });

    it("should apply normally when another Pursuit KOs a retreating Pokemon", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS, SpeciesId.LUVDISC);

      const [magikarp, feebas, luvdisc] = game.scene.getPlayerParty();
      magikarp.hp = 1;

      game.switchPokemon(2);
      game.move.use(MoveId.SPLASH, 1);
      await game.move.forceEnemyMove(MoveId.PURSUIT, BattlerIndex.PLAYER_2);
      await game.move.forceEnemyMove(MoveId.PURSUIT, BattlerIndex.PLAYER_2);
      // Select Luvdisc again during the turn; we expect Magikarp to faint before switching out
      game.selectPartyPokemon(2);

      await game.toNextTurn();

      expect(magikarp).toHaveFainted();
      expect(feebas).not.toHaveFullHp();
      expect(luvdisc.isOnField()).toBe(true);
    });

    it("should not pursue opponents that are forced out", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS, SpeciesId.LUVDISC);

      const [magikarp, feebas, luvdisc] = game.scene.getPlayerParty();

      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
      game.move.use(MoveId.SPLASH, 0);
      game.move.use(MoveId.SPLASH, 1);
      await game.move.forceEnemyMove(MoveId.ROAR, BattlerIndex.PLAYER);
      await game.move.forceEnemyMove(MoveId.PURSUIT, BattlerIndex.PLAYER_2);
      game.selectPartyPokemon(2);
      await game.toEndOfTurn();

      expect(magikarp).toHaveFullHp();
      expect(feebas).not.toHaveFullHp();
      expect(luvdisc).toHaveFullHp();
    });

    it("should bypass redirection when attacking a retreating opponent", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS, SpeciesId.LUVDISC);

      const [magikarp, feebas, luvdisc] = game.scene.getPlayerParty();

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      game.move.use(MoveId.FOLLOW_ME, 0);
      game.move.use(MoveId.U_TURN, 1, BattlerIndex.ENEMY);
      await game.move.forceEnemyMove(MoveId.PURSUIT, BattlerIndex.PLAYER_2);
      game.selectPartyPokemon(2);
      await game.toEndOfTurn();

      expect(magikarp).toHaveFullHp();
      expect(feebas).not.toHaveFullHp();
      expect(luvdisc).toHaveFullHp();
    });

    it("should not bypass redirection when not attacking a retreating opponent", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

      const [magikarp, feebas] = game.scene.getPlayerField();

      game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
      game.move.use(MoveId.FOLLOW_ME, 0);
      game.move.use(MoveId.SPLASH, 1);
      await game.move.forceEnemyMove(MoveId.PURSUIT, BattlerIndex.PLAYER_2);
      await game.toEndOfTurn();

      expect(magikarp).not.toHaveFullHp();
      expect(feebas).toHaveFullHp();
    });
  });
});
