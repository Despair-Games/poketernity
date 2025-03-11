import { allAbilities } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat, type BattleStat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Mirror Armor", () => {
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.MIRROR_ARMOR)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should reflect moves' stat-lowering effects onto the source", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);

    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
    expect(player.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should reflect abilities' stat-lowering effects onto the source", async () => {
    game.override.ability(Abilities.INTIMIDATE);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
    expect(player.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should not divert self-targeted stat-lowering effects", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.OVERHEAT);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.move.forceHit();

    await game.toEndOfTurn();
    expect(enemy.getStatStage(Stat.SPATK)).toBe(-2);
    expect(player.getStatStage(Stat.SPATK)).toBe(0);
  });

  it("should only reflect stat-lowering effects from Spicy Extract", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPICY_EXTRACT);

    await game.toEndOfTurn();
    expect(enemy.getStatStage(Stat.ATK)).toBe(2);
    expect(enemy.getStatStage(Stat.DEF)).toBe(0);
    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(player.getStatStage(Stat.DEF)).toBe(-2);
  });

  it("should not reflect the stat-lowering effect from Octolock", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.OCTOLOCK);

    await game.toNextTurn();
    [Stat.DEF, Stat.SPDEF].forEach((stat: BattleStat) => {
      expect(player.getStatStage(stat)).toBe(0);
      expect(enemy.getStatStage(stat)).toBe(-1);
    });
  });

  it("should not reflect stat-lowering effects from another Pokemon's Mirror Armor", async () => {
    game.override.ability(Abilities.MIRROR_ARMOR);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);

    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
    expect(player.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should reflect Sticky Web's Speed drop if the source is on the field", async () => {
    game.override.startingWave(8);

    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(MoveId.STICKY_WEB);
    await game.move.forceEnemyMove(MoveId.U_TURN);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.toEndOfTurn();

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    expect(player.getStatStage(Stat.SPD)).toBe(-1);
    expect(enemy.getStatStage(Stat.SPD)).toBe(0);
  });

  it("should prevent Sticky Web from activating if its source is not on the field", async () => {
    game.override.startingWave(8);

    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    game.move.use(MoveId.STICKY_WEB);
    await game.toNextTurn();

    game.move.use(MoveId.U_TURN);
    await game.move.forceEnemyMove(MoveId.U_TURN);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.doSelectPartyPokemon(1, "SwitchPhase");

    await game.toEndOfTurn();

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    expect(player.getStatStage(Stat.SPD)).toBe(0);
    expect(enemy.getStatStage(Stat.SPD)).toBe(0);
  });

  it("should not reflect stat-lowering effects targeting the ability source's ally", async () => {
    game.override.battleType("double").enemyAbility(Abilities.NONE);

    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyField();
    vi.spyOn(enemyPokemon[0], "getAbility").mockReturnValue(allAbilities[Abilities.MIRROR_ARMOR]);

    const [player] = game.scene.getPlayerField();

    game.move.use(MoveId.GROWL, 0);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(-1);
    expect(enemyPokemon[1].getStatStage(Stat.ATK)).toBe(-1);
    expect(enemyPokemon[0].getStatStage(Stat.ATK)).toBe(0);
  });

  it("should not reflect stat stage changes for which the source already has -6 stages", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    enemy.setStatStage(Stat.ATK, -6);

    game.move.use(MoveId.NOBLE_ROAR);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(player.getStatStage(Stat.SPATK)).toBe(-1);
    expect(enemy.getStatStage(Stat.ATK)).toBe(-6);
    expect(enemy.getStatStage(Stat.SPATK)).toBe(0);
  });

  it("should not reflect stat stage changes if the source has a Substitute", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.FEATHER_DANCE);
    await game.move.forceEnemyMove(MoveId.SUBSTITUTE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();
    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should be ignored by the attacker's Mold Breaker", async () => {
    game.override.ability(Abilities.MOLD_BREAKER);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);
    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.ATK)).toBe(-1);
    expect(player.getStatStage(Stat.ATK)).toBe(0);
  });

  it("reflected stat changes should be blocked by the attacker's Clear Body", async () => {
    game.override.ability(Abilities.CLEAR_BODY);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);
    await game.toEndOfTurn();

    expect(player.battleData.abilitiesApplied).toContain(Abilities.CLEAR_BODY);
    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });

  /** @todo add this test after implementing Magic Bounce */
  it.todo("should reflect stat-lowering effects previously reflected by Magic Bounce");
});
