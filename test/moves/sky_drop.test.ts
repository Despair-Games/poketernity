import { BattlerIndex } from "#app/battle";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Sky Drop", () => {
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
      .moveset([Moves.SKY_DROP, Moves.TACKLE, Moves.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should bring the user and target to the air, immobilizing the target", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.SKY_DROP);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    [player, enemy].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());
    expect(player.getTag(BattlerTagType.CHARGING)).toBeDefined();
    expect(player.getMoveQueue()[0].move).toBe(Moves.SKY_DROP);
    expect(enemy.turnData.acted).toBeFalsy();

    await game.toNextTurn();

    // player's move selection should be skipped
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase");

    [player, enemy].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined());
    expect(player.getTag(BattlerTagType.CHARGING)).toBeUndefined();
    expect(player.getMoveQueue().length).toBe(0);
    expect(enemy.turnData.acted).toBeFalsy();
  });

  it("should deal no damage to Flying-type Pokemon (but still immobilize them)", async () => {
    game.override.enemySpecies(Species.SKARMORY);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.SKY_DROP);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    [player, enemy].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());
    expect(player.getTag(BattlerTagType.CHARGING)).toBeDefined();
    expect(player.getMoveQueue()[0].move).toBe(Moves.SKY_DROP);
    expect(enemy.turnData.acted).toBeFalsy();

    await game.toNextTurn();

    // player's move selection should be skipped
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase");

    [player, enemy].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined());
    expect(player.getTag(BattlerTagType.CHARGING)).toBeUndefined();
    expect(player.getMoveQueue().length).toBe(0);
    expect(enemy.turnData.acted).toBeFalsy();
    expect(enemy.isFullHp()).toBeTruthy();
  });

  it("should make both the user and target semi-invulnerable", async () => {
    game.override.battleType("double").enemyMoveset([Moves.SPLASH, Moves.TACKLE]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(Moves.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.TACKLE, 1, BattlerIndex.ENEMY);

    await game.forceEnemyMove(Moves.SPLASH);
    await game.forceEnemyMove(Moves.TACKLE, BattlerIndex.PLAYER);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("BerryPhase");

    [playerPokemon, enemyPokemon].forEach((field) => expect(field[0].isFullHp()).toBeTruthy());
    expect(enemyPokemon[0].turnData.acted).toBeFalsy();
  });

  it("No Guard should allow Pokemon to hit other Pokemon under Sky Drop's effect", async () => {
    game.override.battleType("double").enemyAbility(Abilities.NO_GUARD).enemyMoveset([Moves.SPLASH, Moves.TACKLE]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(Moves.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.TACKLE, 1, BattlerIndex.ENEMY);

    await game.forceEnemyMove(Moves.SPLASH);
    await game.forceEnemyMove(Moves.TACKLE, BattlerIndex.PLAYER);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("BerryPhase");

    [playerPokemon, enemyPokemon].forEach((field) => expect(field[0].isFullHp()).toBeFalsy());
    expect(enemyPokemon[0].turnData.acted).toBeFalsy();
  });

  it("Lock On should allow Pokemon to hit other Pokemon under Sky Drop's effect", async () => {
    game.override.battleType("double").enemyMoveset([Moves.LOCK_ON, Moves.SPLASH, Moves.TACKLE]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(Moves.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.SPLASH, 1);

    await game.forceEnemyMove(Moves.SPLASH);
    await game.forceEnemyMove(Moves.LOCK_ON, BattlerIndex.PLAYER);

    await game.setTurnOrder([BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2]);

    await game.phaseInterceptor.to("BerryPhase");

    [playerPokemon, enemyPokemon].forEach((field) => expect(field[0].getTag(BattlerTagType.SKY_DROP)).toBeDefined());
    expect(enemyPokemon[0].turnData.acted).toBeFalsy();

    await game.toNextTurn();

    // the first player should be locked into Sky Drop.
    game.move.select(Moves.SPLASH, 1);

    await game.forceEnemyMove(Moves.SPLASH);
    await game.forceEnemyMove(Moves.TACKLE, BattlerIndex.PLAYER);

    await game.setTurnOrder([BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2]);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(playerPokemon[0].isFullHp()).toBeFalsy();
  });

  it("should do nothing against type-immune targets", async () => {
    game.override.ability(Abilities.NORMALIZE).enemySpecies(Species.DUSCLOPS);

    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(Moves.SKY_DROP);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("BerryPhase");

    game.scene.getField(true).forEach((p) => {
      expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined();
      expect(p.turnData.acted).toBeTruthy();
    });
  });

  it("should do nothing against protected targets", async () => {
    game.override.enemyMoveset(Moves.PROTECT);

    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(Moves.SKY_DROP);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("BerryPhase");

    game.scene.getField(true).forEach((p) => {
      expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined();
      expect(p.turnData.acted).toBeTruthy();
    });
  });

  it("should fail when targeting the user's ally", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const [player1, player2] = game.scene.getPlayerField();

    game.move.select(Moves.SKY_DROP, 0, BattlerIndex.PLAYER_2);
    game.move.select(Moves.SPLASH, 1);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("MoveEndPhase");

    expect(player1.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    [player1, player2].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined());
  });

  it("should fail when targeting a Pokemon over 200 kg", async () => {
    // Snorlax is 460 kg
    game.override.enemySpecies(Species.SNORLAX);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.SKY_DROP);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
    [player, enemy].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined());
  });

  it("should fail when the target has an active substitute", async () => {
    game.override.enemyMoveset(Moves.SUBSTITUTE);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.SKY_DROP);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
    [player, enemy].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined());
  });

  it("should be cancelled when the target Pokemon faints while airborne", async () => {
    game.override.battleType("double").ability(Abilities.NO_GUARD).moveset([Moves.SKY_DROP, Moves.FISSURE]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const player1 = game.scene.getPlayerField()[0];
    const enemy1 = game.scene.getEnemyField()[0];

    game.move.select(Moves.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.FISSURE, 1, BattlerIndex.ENEMY);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(enemy1.isFainted()).toBeTruthy();
    expect(player1.getTag(BattlerTagType.SKY_DROP)).toBeUndefined();
    expect(player1.getTag(BattlerTagType.CHARGING)).toBeUndefined();
    expect(player1.getMoveQueue().length).toBe(0);
  });

  it("should be cancelled when another Pokemon uses Gravity", async () => {
    game.override.battleType("double").moveset([Moves.SKY_DROP, Moves.GRAVITY]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const player1 = game.scene.getPlayerField()[0];
    const enemy1 = game.scene.getEnemyField()[0];

    game.move.select(Moves.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.GRAVITY, 1);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    // player 1 uses Sky Drop
    await game.phaseInterceptor.to("MoveEndPhase");

    [player1, enemy1].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());

    // player 2 uses Gravity
    await game.phaseInterceptor.to("MoveEndPhase");
    [player1, enemy1].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined());
    expect(player1.getTag(BattlerTagType.CHARGING)).toBeUndefined();
    expect(player1.getMoveQueue().length).toBe(0);

    // enemy uses Splash (if still in Sky Drop, this would be skipped)
    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy1.turnData.acted).toBeTruthy();
  });

  it("should bypass the effects of the 'Center of Attention' status", async () => {
    game.override.battleType("double").enemyMoveset([Moves.FOLLOW_ME, Moves.SPLASH]);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const player1 = game.scene.getPlayerField()[0];
    const enemy1 = game.scene.getEnemyField()[0];

    game.move.select(Moves.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.SPLASH, 1);

    await game.forceEnemyMove(Moves.SPLASH);
    await game.forceEnemyMove(Moves.FOLLOW_ME);

    await game.setTurnOrder([BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.PLAYER_2]);

    await game.phaseInterceptor.to("BerryPhase");

    [player1, enemy1].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());
    expect(enemy1.turnData.acted).toBeFalsy();
  });

  // Custom interaction
  it("should be cancelled when the target jumps into an ally Dondozo with Commander", async () => {
    game.override
      .battleType("double")
      .enemyMoveset([Moves.SKY_DROP, Moves.SPLASH])
      .ability(Abilities.COMMANDER)
      .moveset([Moves.SPLASH, Moves.FLIP_TURN]);

    vi.spyOn(game.scene, "triggerPokemonBattleAnim").mockReturnValue(true);

    await game.classicMode.startBattle([Species.MAGIKARP, Species.TATSUGIRI, Species.DONDOZO]);

    const tatsugiri = game.scene.getPlayerField()[1];
    const enemy1 = game.scene.getEnemyField()[0];

    game.move.select(Moves.FLIP_TURN, 0, BattlerIndex.ENEMY_2);
    game.move.select(Moves.SPLASH);

    await game.forceEnemyMove(Moves.SKY_DROP, BattlerIndex.PLAYER_2);
    await game.forceEnemyMove(Moves.SPLASH);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER_2]);

    await game.phaseInterceptor.to("MoveEndPhase");

    [tatsugiri, enemy1].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());

    game.doSelectPartyPokemon(2, "SwitchPhase");
    await game.phaseInterceptor.to("MoveEndPhase");

    [tatsugiri, enemy1].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeUndefined());
    expect(tatsugiri.getMoveQueue().length).toBe(0);
    expect(tatsugiri.getTag(BattlerTagType.CHARGING)).toBeFalsy();

    const dondozo = game.scene.getPlayerField()[0];

    expect(dondozo.getTag(BattlerTagType.COMMANDED)).toBeTruthy();
  });
});
