import { BattlerIndex } from "#enums/battler-index";
import { allAbilities } from "#app/data/data-lists";
import { type PostDefendContactApplyStatusEffectAbAttr } from "#app/data/abilities/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { AbilityId } from "#enums/ability-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AbAttrFlag } from "#enums/ab-attr-flag";

describe("Moves - Safeguard", () => {
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
      .enemySpecies(SpeciesId.DRATINI)
      .enemyMoveset([MoveId.SAFEGUARD])
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyLevel(5)
      .starterSpecies(SpeciesId.DRATINI)
      .moveset([MoveId.NUZZLE, MoveId.SPORE, MoveId.YAWN, MoveId.SPLASH])
      .ability(AbilityId.UNNERVE); // Stop wild Pokemon from potentially eating Lum Berry
  });

  it("protects from damaging moves with additional effects", async () => {
    await game.classicMode.startBattle();
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.select(MoveId.NUZZLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
  });

  it("protects from status moves", async () => {
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPORE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
  });

  it("protects from confusion", async () => {
    game.override.moveset([MoveId.CONFUSE_RAY]);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.CONFUSE_RAY);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.summonData.tags).toEqual([]);
  });

  it("protects ally from status", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle();

    game.move.select(MoveId.SPORE, 0, BattlerIndex.ENEMY_2);
    game.move.select(MoveId.NUZZLE, 1, BattlerIndex.ENEMY_2);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.toEndOfTurn();

    const enemyPokemon = game.scene.getEnemyField();

    expect(enemyPokemon[0].getStatusEffect()).toBe(StatusEffect.NONE);
    expect(enemyPokemon[1].getStatusEffect()).toBe(StatusEffect.NONE);
  });

  it("protects from Yawn", async () => {
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.YAWN);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.summonData.tags).toEqual([]);
  });

  it("doesn't protect from already existing Yawn", async () => {
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.YAWN);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.SLEEP);
  });

  it("doesn't protect from self-inflicted via Rest or Flame Orb", async () => {
    game.override.enemyHeldItems([{ name: "FLAME_ORB" }]);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    enemyPokemon.damageAndUpdate(1);

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.BURN);

    game.override.enemyMoveset([MoveId.REST]);
    // Force the moveset to update mid-battle
    // TODO: Remove after enemy AI rework is in
    enemyPokemon.getMoveset();
    game.move.select(MoveId.SPLASH);
    enemyPokemon.damageAndUpdate(1);
    await game.toNextTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.SLEEP);
  });

  it("protects from ability-inflicted status", async () => {
    game.override.ability(AbilityId.STATIC);
    vi.spyOn(
      allAbilities[AbilityId.STATIC].getAttrs<PostDefendContactApplyStatusEffectAbAttr>(
        AbAttrFlag.POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT,
      )[0],
      "chance",
      "get",
    ).mockReturnValue(100);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    game.override.enemyMoveset([MoveId.TACKLE]);
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });

  it("should apply even if the user has a fainted ally", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle();

    game.move.use(MoveId.SPORE, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.NUZZLE, 1, BattlerIndex.ENEMY);
    await game.move.forceEnemyMove(MoveId.SAFEGUARD);
    await game.move.forceEnemyMove(MoveId.MEMENTO, BattlerIndex.PLAYER);

    game.setTurnOrder([BattlerIndex.ENEMY_2, BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);

    const enemyPokemon = game.scene.getEnemyField();

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemyPokemon[1].isFainted()).toBe(true);

    await game.toNextTurn();
    expect(enemyPokemon[0].getStatusEffect(true)).toBe(StatusEffect.NONE);
  });
});
