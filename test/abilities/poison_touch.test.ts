import { BattlerIndex } from "#enums/battler-index";
import { type PostAttackApplyStatusEffectAbAttr } from "#app/data/abilities/ab-attrs/post-attack-apply-status-effect-ab-attr";
import type { EnemyPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AbAttrFlag } from "#enums/ab-attr-flag";

describe("Abilities - Poison Touch", () => {
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
      .ability(Abilities.POISON_TOUCH)
      .moveset([MoveId.DRAINING_KISS, MoveId.EARTHQUAKE, MoveId.LEER, MoveId.DRAGON_TAIL])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(100);
    vi.spyOn(globalScene, "randBattleSeedInt").mockImplementation((_range, min: 0) => min); // Force Poison RNG rolls to succeed
  });

  /**
   * Checks that the enemy Pokemon is poisoned after using a given move against it.
   */
  async function checkSucceedPoison(moveId: MoveId, enemyPokemon: EnemyPokemon) {
    game.move.select(moveId);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.POISON);
  }

  /**
   * Checks that the enemy Pokemon is not statused after using a given move against it.
   */
  async function checkFailPoison(moveId: MoveId, enemyPokemon: EnemyPokemon) {
    game.move.select(moveId);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.NONE);
  }

  it("should have a 30% chance of poisoning the target with an attack that makes contact", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const abilityAttr = playerPokemon
      .getAbility()
      .getAttrs<PostAttackApplyStatusEffectAbAttr>(AbAttrFlag.POST_ATTACK_APPLY_STATUS_EFFECT)[0];

    await checkSucceedPoison(MoveId.DRAINING_KISS, enemyPokemon);
    expect(abilityAttr.chance).toBe(30);
  });

  it("should not apply to attacks that do not make contact", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(MoveId.EARTHQUAKE, enemyPokemon);
  });

  it("should not apply to status moves", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(MoveId.LEER, enemyPokemon);
  });

  it("should still apply to phazing attacks in trainer battles", async () => {
    game.override.startingWave(5);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkSucceedPoison(MoveId.DRAGON_TAIL, enemyPokemon);
    expect(enemyPokemon.isOnField()).toBe(false);
  });

  it("should apply for each hit of a multi-hit move independently", async () => {
    game.override.moveset(MoveId.DOUBLE_IRON_BASH);
    await game.classicMode.startBattle([Species.FEEBAS]);

    // Force setting status to fail so that the game tries again multiple times
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "trySetStatus").mockImplementation(() => false);

    game.move.select(MoveId.DOUBLE_IRON_BASH);
    await game.toNextTurn();

    expect(enemyPokemon.trySetStatus).toHaveBeenCalledTimes(2);
  });

  it("should stack with moves that already have a chance to poison", async () => {
    game.override.moveset(MoveId.POISON_JAB);
    await game.classicMode.startBattle([Species.FEEBAS]);

    // Force setting status to fail so that the game tries again multiple times
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "trySetStatus").mockImplementation(() => false);

    game.move.select(MoveId.POISON_JAB);
    await game.toNextTurn();

    expect(enemyPokemon.trySetStatus).toHaveBeenCalledTimes(2);
  });

  it("should not apply if the target is already statused", async () => {
    game.override.enemyStatusEffect(StatusEffect.BURN);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.DRAINING_KISS);
    await game.toNextTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.BURN);
  });

  it("should not apply against a target with Shield Dust, unless the contact-making move is Sunsteel Strike", async () => {
    game.override
      .enemyAbility(Abilities.SHIELD_DUST)
      .moveset([MoveId.TACKLE, MoveId.MOONGEIST_BEAM, MoveId.SUNSTEEL_STRIKE]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    // Turn 1: Fails to poison because of target's Shield Dust
    await checkFailPoison(MoveId.TACKLE, enemyPokemon);

    // Turn 2: Fails to poison since Moongeist Beam does not make contact
    await checkFailPoison(MoveId.MOONGEIST_BEAM, enemyPokemon);

    // Turn 3: Successfully poisons
    await checkSucceedPoison(MoveId.SUNSTEEL_STRIKE, enemyPokemon);
  });

  it("should not normally apply against a target with Immunity", async () => {
    game.override.enemyAbility(Abilities.IMMUNITY);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(MoveId.DRAINING_KISS, enemyPokemon);
  });

  it("should not normally apply against a target with active Leaf Guard", async () => {
    game.override.enemyAbility(Abilities.LEAF_GUARD).enemyMoveset(MoveId.SUNNY_DAY);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(MoveId.DRAINING_KISS, enemyPokemon);
  });

  it("should not apply if the move hits a Substitute", async () => {
    game.override.enemyMoveset(MoveId.SUBSTITUTE);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(MoveId.DRAINING_KISS, enemyPokemon);
  });

  // TODO: Fix this interaction to pass the test
  it.todo("should still apply against a target with Mummy", async () => {
    game.override.enemyAbility(Abilities.MUMMY);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkSucceedPoison(MoveId.DRAINING_KISS, enemyPokemon);
    expect(playerPokemon.getAbility().id).toBe(Abilities.MUMMY);
  });
});
