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
    game.overridesHelper
      .ability(Abilities.POISON_TOUCH)
      .moveset([Moves.DRAINING_KISS, Moves.EARTHQUAKE, Moves.LEER, Moves.DRAGON_TAIL])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .enemyLevel(100);
    vi.spyOn(globalScene, "randBattleSeedInt").mockImplementation((_range, min: 0) => min); // Force Poison RNG rolls to succeed
  });

  /**
   * Checks that the enemy Pokemon is poisoned after using a given move against it.
   */
  async function checkSucceedPoison(move: Moves, enemyPokemon: EnemyPokemon) {
    game.moveHelper.select(move);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(enemyPokemon.status?.effect).toBe(StatusEffect.POISON);
  }

  /**
   * Checks that the enemy Pokemon is not statused after using a given move against it.
   */
  async function checkFailPoison(move: Moves, enemyPokemon: EnemyPokemon) {
    game.moveHelper.select(move);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(enemyPokemon.status?.effect).toBeUndefined();
  }

  it("should have a 30% chance of poisoning the target with an attack that makes contact", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const abilityAttr = playerPokemon
      .getAbility()
      .getAttrs(PostAttackApplyStatusEffectAbAttr)[0] as PostAttackApplyStatusEffectAbAttr;

    await checkSucceedPoison(Moves.DRAINING_KISS, enemyPokemon);
    expect(abilityAttr.chance).toBe(30);
  });

  it("should not apply to attacks that do not make contact", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.EARTHQUAKE, enemyPokemon);
  });

  it("should not apply to status moves", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.LEER, enemyPokemon);
  });

  it("should still apply to phazing attacks in trainer battles", async () => {
    game.overridesHelper.startingWave(5);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkSucceedPoison(Moves.DRAGON_TAIL, enemyPokemon);
    expect(enemyPokemon.isOnField()).toBe(false);
  });

  it("should apply for each hit of a multi-hit move independently", async () => {
    game.overridesHelper.moveset(Moves.DOUBLE_IRON_BASH);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    // Force setting status to fail so that the game tries again multiple times
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "trySetStatus").mockImplementation(() => false);

    game.moveHelper.select(Moves.DOUBLE_IRON_BASH);
    await game.toNextTurn();

    expect(enemyPokemon.trySetStatus).toHaveBeenCalledTimes(2);
  });

  it("should stack with moves that already have a chance to poison", async () => {
    game.overridesHelper.moveset(Moves.POISON_JAB);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    // Force setting status to fail so that the game tries again multiple times
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "trySetStatus").mockImplementation(() => false);

    game.moveHelper.select(Moves.POISON_JAB);
    await game.toNextTurn();

    expect(enemyPokemon.trySetStatus).toHaveBeenCalledTimes(2);
  });

  it("should not apply if the target is already statused", async () => {
    game.overridesHelper.enemyStatusEffect(StatusEffect.BURN);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.DRAINING_KISS);
    await game.toNextTurn();

    expect(enemyPokemon.status?.effect).toBe(StatusEffect.BURN);
  });

  it("should not apply against a target with Shield Dust, unless the contact-making move is Sunsteel Strike", async () => {
    game.overridesHelper
      .enemyAbility(Abilities.SHIELD_DUST)
      .moveset([Moves.TACKLE, Moves.MOONGEIST_BEAM, Moves.SUNSTEEL_STRIKE]);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    // Turn 1: Fails to poison because of target's Shield Dust
    await checkFailPoison(Moves.TACKLE, enemyPokemon);

    // Turn 2: Fails to poison since Moongeist Beam does not make contact
    await checkFailPoison(Moves.MOONGEIST_BEAM, enemyPokemon);

    // Turn 3: Successfully poisons
    await checkSucceedPoison(Moves.SUNSTEEL_STRIKE, enemyPokemon);
  });

  it("should not normally apply against a target with Immunity", async () => {
    game.overridesHelper.enemyAbility(Abilities.IMMUNITY);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.DRAINING_KISS, enemyPokemon);
  });

  it("should not normally apply against a target with active Leaf Guard", async () => {
    game.overridesHelper.enemyAbility(Abilities.LEAF_GUARD).enemyMoveset(Moves.SUNNY_DAY);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.DRAINING_KISS, enemyPokemon);
  });

  it("should not apply if the move hits a Substitute", async () => {
    game.overridesHelper.enemyMoveset(Moves.SUBSTITUTE);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkFailPoison(Moves.DRAINING_KISS, enemyPokemon);
  });

  // TODO: Fix this interaction to pass the test
  it.todo("should still apply against a target with Mummy", async () => {
    game.overridesHelper.enemyAbility(Abilities.MUMMY);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    await checkSucceedPoison(Moves.DRAINING_KISS, enemyPokemon);
    expect(playerPokemon.getAbility().id).toBe(Abilities.MUMMY);
  });
});
