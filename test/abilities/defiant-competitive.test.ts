import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#enums/battler-index";

describe.each([
  { name: "Defiant", isDefiant: true },
  { name: "Competitive", isDefiant: false },
])("Abilities - $name", ({ isDefiant }) => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.BEEDRILL)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(1)
      .ability(isDefiant ? AbilityId.DEFIANT : AbilityId.COMPETITIVE);
  });

  it("should activate multiple times in response to multiple simultaneous stat drops", async () => {
    await game.classicMode.startBattle([SpeciesId.FLYGON]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.TICKLE);
    await game.toEndOfTurn();

    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([3, -1, 0, 0, 0, 0, 0]); // +3 Atk, -1 Def
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([-1, -1, 4, 0, 0, 0, 0]); // -1 Atk, -1 Def, 4 SpA
    }
  });

  it("should activate exactly once in response to a single -2 stat drop", async () => {
    await game.classicMode.startBattle([SpeciesId.FLYGON]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SWEET_SCENT);
    await game.toEndOfTurn();

    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([2, 0, 0, 0, 0, 0, -2]); // +2 Atk, -2 Eva
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 2, 0, 0, 0, -2]); // +2 SpA, -2 Eva
    }
  });

  it("should not activate in response to a stat increase", async () => {
    await game.classicMode.startBattle([SpeciesId.FLYGON]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.FLATTER);
    await game.toEndOfTurn();

    expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 1, 0, 0, 0, 0]); // +1 SpA
  });

  it("should not activate if the user lowers its own stats", async () => {
    await game.classicMode.startBattle([SpeciesId.FLYGON]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.CLOSE_COMBAT);
    await game.toEndOfTurn();

    expect(playerPokemon.getStatStages()).toStrictEqual([0, -1, 0, -1, 0, 0, 0]); // 0 Atk, -1 Def, -1 SpD
  });

  it("should not activate if the user's ally lowers the user's stats", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([SpeciesId.FLYGON, SpeciesId.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.SMOKESCREEN, 1, BattlerIndex.PLAYER);
    await game.toEndOfTurn();

    expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 0, 0, 0, -1, 0]); // 0 Atk, -1 Acc
  });

  it("should activate against an opponent's Octolock", async () => {
    await game.classicMode.startBattle([SpeciesId.FLYGON]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.OCTOLOCK);
    await game.toNextTurn();

    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([4, -1, 0, -1, 0, 0, 0]); // +4 Atk, -1 Def, -1 SpD
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([0, -1, 4, -1, 0, 0, 0]); // +4 SpA, -1 Def, -1 SpD
    }
  });

  it("should not activate against an ally's Octolock", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([SpeciesId.FLYGON, SpeciesId.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.OCTOLOCK, 1, BattlerIndex.PLAYER);
    await game.toNextTurn();

    expect(playerPokemon.getStatStages()).toStrictEqual([0, -1, 0, -1, 0, 0, 0]); // 0 Atk, -1 Def, -1 SpD
  });

  it("should activate against an opponent's Syrup Bomb", async () => {
    game.override.startingLevel(100).passiveAbility(AbilityId.NO_GUARD);
    await game.classicMode.startBattle([SpeciesId.DRAGONITE]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SYRUP_BOMB);
    await game.toNextTurn();

    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([2, 0, 0, 0, -1, 0, 0]); // +2 Atk, -1 Spe
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 2, 0, -1, 0, 0]); // +2 Atk, -1 Spe
    }

    // Allow Syrup Bomb's speed decrease to activate a second time
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([4, 0, 0, 0, -2, 0, 0]); // +4 Atk, -2 Spe
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 4, 0, -2, 0, 0]); // +4 Atk, -2 Spe
    }
  });

  it("should not activate against an ally's Octolock", async () => {
    game.override.startingLevel(100).passiveAbility(AbilityId.NO_GUARD).battleType("double");
    await game.classicMode.startBattle([SpeciesId.DRAGONITE, SpeciesId.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.SYRUP_BOMB, 1, BattlerIndex.PLAYER);
    await game.toNextTurn();

    expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 0, 0, -1, 0, 0]); // 0 Atk, -1 Spe

    // Allow Syrup Bomb's speed decrease to activate a second time
    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.SPLASH, 1);
    await game.toNextTurn();

    expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 0, 0, -2, 0, 0]); // 0 Atk, -2s Spe
  });

  it("should activate against an opponent's Mirror Armor", async () => {
    game.override.enemyAbility(AbilityId.MIRROR_ARMOR);
    await game.classicMode.startBattle([SpeciesId.FLYGON]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SMOKESCREEN);
    await game.toEndOfTurn();

    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([2, 0, 0, 0, 0, -1, 0]); // +2 Atk, -1 Acc
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 2, 0, 0, -1, 0]); // +2 SpA, -1 Acc
    }
  });

  it("should not activate against an ally's Mirror Armor", async () => {
    game.override.battleType("double").passiveAbility(AbilityId.MIRROR_ARMOR);
    await game.classicMode.startBattle([SpeciesId.FLYGON, SpeciesId.CORVIKNIGHT]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SMOKESCREEN, 0, BattlerIndex.PLAYER_2);
    game.move.use(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 0, 0, 0, -1, 0]); // 0 Atk, -1 Acc
  });

  it("should activate against a Sticky Web that swapped back to the user via Court Change", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const playerPokemon = game.field.getPlayerPokemon();

    // Turn 1: Sticky Web + Court Change
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.STICKY_WEB);
    await game.move.forceEnemyMove(MoveId.COURT_CHANGE);
    await game.toNextTurn();

    // Turn 2: Switch out
    game.switchPokemon(1);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    // Turn 3: Switch back into original Sticky Web user
    game.switchPokemon(1);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([2, 0, 0, 0, -1, 0, 0]); // +2 Atk, -1 Spe
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 2, 0, -1, 0, 0]); // +2 SpA, -1 Spe
    }
  });

  it("should activate before White Herb is allowed to activate", async () => {
    game.override.startingHeldItems([{ name: "WHITE_HERB" }]);
    await game.classicMode.startBattle([SpeciesId.FLYGON]);

    const playerPokemon = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    // The stat decrease will be nullified by the ability's stat increase
    await game.move.forceEnemyMove(isDefiant ? MoveId.GROWL : MoveId.CONFIDE);
    await game.toEndOfTurn();

    if (isDefiant) {
      expect(playerPokemon.getStatStages()).toStrictEqual([1, 0, 0, 0, 0, 0, 0]); // +1 Atk
    } else {
      expect(playerPokemon.getStatStages()).toStrictEqual([0, 0, 1, 0, 0, 0, 0]); // +1 SpA
    }
    expect(playerPokemon.getHeldItems()[0].type.id).toBe("WHITE_HERB");
  });
});
