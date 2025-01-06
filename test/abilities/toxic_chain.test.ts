import { BattlerIndex } from "#app/battle";
import { PostAttackApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-attack-apply-status-effect-ab-attr";
import type { EnemyPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Toxic Chain", () => {
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
      .ability(Abilities.TOXIC_CHAIN)
      .moveset([Moves.WATER_GUN, Moves.LEER, Moves.DRAGON_TAIL, Moves.TACKLE])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .enemyLevel(100);
    vi.spyOn(globalScene, "randBattleSeedInt").mockImplementation((_range, min: 0) => min); // Force Toxic RNG rolls to succeed
  });

  /**
   * Checks that the enemy Pokemon is badly poisoned after using a given move against it.
   */
  async function checkSucceedPoison(move: Moves, enemyPokemon: EnemyPokemon) {
    game.move.select(move);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(enemyPokemon.status?.effect).toBe(StatusEffect.TOXIC);
  }

  /**
   * Checks that the enemy Pokemon is not statused after using a given move against it.
   */
  async function checkFailPoison(move: Moves, enemyPokemon: EnemyPokemon) {
    game.move.select(move);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(enemyPokemon.status?.effect).toBeUndefined();
  }

  it("should have a 30% chance of badly poisoning the target", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const abilityAttr = playerPokemon
      .getAbility()
      .getAttrs(PostAttackApplyStatusEffectAbAttr)[0] as PostAttackApplyStatusEffectAbAttr;

    await checkSucceedPoison(Moves.WATER_GUN, enemyPokemon);
    expect(abilityAttr.chance).toBe(30);
  });

  it("should not apply to status moves", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.LEER, enemyPokemon);
  });

  it("should still apply to phazing attacks in trainer battles", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkSucceedPoison(Moves.DRAGON_TAIL, enemyPokemon);
    expect(enemyPokemon.isOnField()).toBe(false);
  });

  it("should apply for each hit of a multi-hit move independently", async () => {
    game.override.moveset(Moves.DOUBLE_IRON_BASH);
    await game.classicMode.startBattle([Species.FEEBAS]);

    // Force setting status to fail so that the game tries again multiple times
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "trySetStatus").mockImplementation(() => false);

    game.move.select(Moves.DOUBLE_IRON_BASH);
    await game.toNextTurn();

    expect(enemyPokemon.trySetStatus).toHaveBeenCalledTimes(2);
  });

  it("should stack with moves that already have a chance to poison", async () => {
    game.override.moveset(Moves.POISON_FANG);
    await game.classicMode.startBattle([Species.FEEBAS]);

    // Force setting status to fail so that the game tries again multiple times
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "trySetStatus").mockImplementation(() => false);

    game.move.select(Moves.POISON_FANG);
    await game.toNextTurn();

    expect(enemyPokemon.trySetStatus).toHaveBeenCalledTimes(2);
  });

  it("should not apply if the target is already statused", async () => {
    game.override.enemyStatusEffect(StatusEffect.BURN);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.TACKLE);
    await game.toNextTurn();

    expect(enemyPokemon.status?.effect).toBe(StatusEffect.BURN);
  });

  it("should not apply against a target with Shield Dust, unless the attack ignores abilities", async () => {
    game.override.enemyAbility(Abilities.SHIELD_DUST).moveset([Moves.TACKLE, Moves.MOONGEIST_BEAM]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.TACKLE, enemyPokemon);

    await checkSucceedPoison(Moves.MOONGEIST_BEAM, enemyPokemon);
  });

  it("should not normally apply against a target with Immunity", async () => {
    game.override.enemyAbility(Abilities.IMMUNITY);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.WATER_GUN, enemyPokemon);
  });

  it("should not normally apply against a target with active Leaf Guard", async () => {
    game.override.enemyAbility(Abilities.LEAF_GUARD).enemyMoveset(Moves.SUNNY_DAY);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.WATER_GUN, enemyPokemon);
  });

  it("should not apply if the move hits a Substitute", async () => {
    game.override.enemyMoveset(Moves.SUBSTITUTE).moveset([Moves.TACKLE, Moves.DISARMING_VOICE]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    // Turn 1: Should not poison since the move hit a Substitute
    await checkFailPoison(Moves.TACKLE, enemyPokemon);

    // Turn 2: Should poison since Disarming Voice bypasses Substitute
    await checkSucceedPoison(Moves.DISARMING_VOICE, enemyPokemon);
  });

  // TODO: Fix this interaction to pass the test
  it.todo("should still apply against a target with Mummy", async () => {
    game.override.enemyAbility(Abilities.MUMMY);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkSucceedPoison(Moves.TACKLE, enemyPokemon);
    expect(playerPokemon.getAbility().id).toBe(Abilities.MUMMY);
  });
});
