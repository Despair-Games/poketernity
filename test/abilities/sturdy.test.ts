import { SturdyAbAttr } from "#abilities/sturdy-ab-attr";
import { DestinyBondTag } from "#battler-tags/destiny-bond-tag";
import { IGNORING_ABILITIES } from "#constants/ability-constants";
import { SACRIFICIAL_MOVES } from "#constants/move-constants";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { SurviveDamageModifier } from "#modifier/modifier";
import { FaintCountdownAttr } from "#moves/faint-countdown-attr";
import { GameManager } from "#test/test-utils/game-manager";
import { enumValueToKey } from "#utils/common-utils";
import { capitalizeString } from "#utils/string-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

//#region Test Constants

const ignoringAbilities = IGNORING_ABILITIES.map<[string, AbilityId]>((abilityId) => [
  capitalizeString(enumValueToKey(AbilityId, abilityId), "_", false, true) ?? "",
  abilityId,
]);

const sacrificialMoves = SACRIFICIAL_MOVES.map<[string, MoveId]>((moveId) => [
  capitalizeString(enumValueToKey(MoveId, moveId), "_", false, true) ?? "",
  moveId,
]);

//#endregion

describe("Abilities - Sturdy", () => {
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
      .startingLevel(100)
      .disableCrits()
      .enemySpecies(SpeciesId.ARON)
      .enemyLevel(5)
      .enemyAbility(AbilityId.STURDY)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should proc when user is at full HP", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.CLOSE_COMBAT);
    await phaseInterceptor.to("PostActionPhase");

    expect(enemy).toHaveHp(1);
  });

  it("should NOT proc when user is NOT at full HP", async () => {
    const { classicMode, field, move } = game;
    await classicMode.startBattle(SpeciesId.LUCARIO);

    const enemy = field.getEnemyPokemon();
    enemy.damageAndUpdate(1);

    expect(enemy).not.toHaveFullHp();

    move.use(MoveId.CLOSE_COMBAT);
    await game.toEndOfTurn();

    expect(enemy).toHaveFainted();
  });

  it("should be immune to OHKO moves", async () => {
    const { classicMode, field, move } = game;

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const player = field.getPlayerPokemon();
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.FISSURE);
    await game.toEndOfTurn();

    expect(player).toHaveMoveResult(MoveResult.FAIL);
    expect(enemy).toHaveFullHp();
  });

  it("should proc on self-inflicted damage", async () => {
    const { override, classicMode, field, move } = game;
    override.statusActivation(true); // Force confusion to proc

    await classicMode.runToSummon(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();
    enemy.setStat(Stat.HP, 3);
    enemy.hp = 3;
    enemy.addTag(BattlerTagType.CONFUSED);

    expect(enemy).toHaveFullHp();

    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemy).toHaveHp(1);
  });

  it("should proc again if healed back to full HP", async () => {
    const { classicMode, field, move } = game;

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    for (let turn = 1; turn < 3; turn++) {
      enemy.heal(enemy.getMaxHp(), true); // Heal back to full HP

      expect(enemy).toHaveFullHp();

      move.use(MoveId.CLOSE_COMBAT);
      await game.toEndOfTurn();

      expect(enemy).toHaveHp(1);
    }
  });

  it("takes precedence over 'Focus Band' item", async () => {
    const { override, classicMode, field, move } = game;
    override.enemyHeldItems([{ name: "FOCUS_BAND", count: Number.MAX_SAFE_INTEGER }]); // Make sure Focus Band would always proc
    vi.spyOn(SurviveDamageModifier.prototype, "shouldApply");

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.CLOSE_COMBAT);
    await game.toEndOfTurn();

    expect(SurviveDamageModifier.prototype.shouldApply).not.toHaveBeenCalled(); // Focus Band check wasn't triggered
    expect(enemy).toHaveHp(1);
  });

  it.each(ignoringAbilities)("should be ignored by '%s' ability", async (_abilityName, abilityId) => {
    const { override, classicMode, field, move } = game;
    override.ability(abilityId);

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.CLOSE_COMBAT);
    await game.toEndOfTurn();

    expect(enemy).toHaveFainted();
  });

  it("should only proc on full HP for multi-hit moves", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.DOUBLE_KICK);
    await phaseInterceptor.to("MoveEffectPhase", true);

    expect(enemy).toHaveHp(1); // endure first hit

    await game.toEndOfTurn();

    expect(enemy).toHaveFainted();
  });

  it("should keep proccing for multi-hit moves as long as it is at full HP", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.DOUBLE_KICK);
    await phaseInterceptor.to("MoveEffectPhase", true);

    expect(enemy).toHaveHp(1); // endure first hit
    enemy.heal(enemy.getMaxHp(), true); // Heal back to full HP

    await game.toEndOfTurn();

    expect(enemy).toHaveHp(1); // endure second hit
  });

  it("should not proc on 'Perish Song' move", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    vi.spyOn(FaintCountdownAttr.prototype, "turnCountMin", "get").mockReturnValue(1);
    vi.spyOn(FaintCountdownAttr.prototype, "turnCountMax", "get").mockReturnValue(1);

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.PERISH_SONG);
    await game.toEndOfTurn();

    move.use(MoveId.SPLASH);
    await phaseInterceptor.to("PostKnockoutPhase", true);

    expect(enemy).toHaveFainted();
  });

  it("should not proc on 'Destiny Bond' move", async () => {
    const { classicMode, field, move } = game;
    vi.spyOn(DestinyBondTag.prototype, "lapse");

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const player = field.getPlayerPokemon();
    player.damageAndUpdate(player.getMaxHp() - 1);

    expect(player).toHaveHp(1);

    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveFullHp();

    move.use(MoveId.DESTINY_BOND);
    await move.forceEnemyMove(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(player).toHaveFainted();
    expect(enemy).toHaveFainted();
    expect(DestinyBondTag.prototype.lapse).toHaveBeenCalled();
  });

  it.each(sacrificialMoves)("should not proc on sacrificial '%s' move", async (_enemyMoveName, enemyMoveId) => {
    // The check is turned around here. The player has sturdy and should faint. This is due to moves like Healing Wish or Lunar Dance requiring a party
    const { override, classicMode, field, move } = game;
    override.ability(AbilityId.STURDY).enemyLevel(999);
    await classicMode.startBattle(SpeciesId.LUCARIO, SpeciesId.LUGIA);

    const player = field.getPlayerPokemon();

    expect(player).toHaveFullHp();

    move.use(enemyMoveId);
    await game.toEndOfTurn();

    expect(player).toHaveFainted();
  });

  // See Issue #523 (fixed in PR #1215)
  it("should proc properly on Boss Pokemon and deplete all hp-segments but the last", async () => {
    const { override, classicMode, field, move } = game;
    override.startingWave(50);

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy.isBoss()).toBe(true);
    expect(enemy.bossSegments).toBe(2);
    expect(enemy.bossSegmentIndex).toBe(1);
    expect(enemy).toHaveFullHp();

    move.use(MoveId.CLOSE_COMBAT);
    await game.toEndOfTurn();

    expect(enemy.bossSegmentIndex).toBe(0); // Boss is on the last hp-segment
    expect(enemy).toHaveHp(1); // and has 1 hp left!
  });

  it("should not proc when 'Wonder Guard' ability is present too", async () => {
    const { override, classicMode, field, move } = game;
    override.enemySpecies(SpeciesId.SHEDINJA).enemyPassiveAbility(AbilityId.WONDER_GUARD);
    vi.spyOn(SturdyAbAttr.prototype, "apply");

    await classicMode.startBattle(SpeciesId.LUCARIO);
    const enemy = field.getEnemyPokemon();

    expect(enemy).toHaveHp(1);
    expect(enemy).toHaveFullHp();

    move.use(MoveId.AERIAL_ACE);
    await game.toEndOfTurn();

    expect(SturdyAbAttr.prototype.apply).toHaveReturnedWith(false);
    expect(enemy).toHaveFainted();
  });
});
