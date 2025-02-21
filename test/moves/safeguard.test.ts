import { BattlerIndex } from "#enums/battler-index";
import { allAbilities } from "#app/data/data-lists";
import { type PostDefendContactApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
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
      .enemySpecies(Species.DRATINI)
      .enemyMoveset([MoveId.SAFEGUARD])
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyLevel(5)
      .starterSpecies(Species.DRATINI)
      .moveset([MoveId.NUZZLE, MoveId.SPORE, MoveId.YAWN, MoveId.SPLASH])
      .ability(Abilities.UNNERVE); // Stop wild Pokemon from potentially eating Lum Berry
  });

  it("protects from damaging moves with additional effects", async () => {
    await game.classicMode.startBattle();
    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.NUZZLE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemy.status).toBeUndefined();
  });

  it("protects from status moves", async () => {
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPORE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.status).toBeUndefined();
  });

  it("protects from confusion", async () => {
    game.override.moveset([MoveId.CONFUSE_RAY]);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.CONFUSE_RAY);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.summonData.tags).toEqual([]);
  });

  it("protects ally from status", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle();

    game.move.select(MoveId.SPORE, 0, BattlerIndex.ENEMY_2);
    game.move.select(MoveId.NUZZLE, 1, BattlerIndex.ENEMY_2);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.toEndOfTurn();

    const enemyPokemon = game.scene.getEnemyField();

    expect(enemyPokemon[0].status).toBeUndefined();
    expect(enemyPokemon[1].status).toBeUndefined();
  });

  it("protects from Yawn", async () => {
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.YAWN);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.summonData.tags).toEqual([]);
  });

  it("doesn't protect from already existing Yawn", async () => {
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.YAWN);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemyPokemon.status?.effect).toEqual(StatusEffect.SLEEP);
  });

  it("doesn't protect from self-inflicted via Rest or Flame Orb", async () => {
    game.override.enemyHeldItems([{ name: "FLAME_ORB" }]);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    enemyPokemon.damageAndUpdate(1);

    expect(enemyPokemon.status?.effect).toEqual(StatusEffect.BURN);

    game.override.enemyMoveset([MoveId.REST]);
    // Force the moveset to update mid-battle
    // TODO: Remove after enemy AI rework is in
    enemyPokemon.getMoveset();
    game.move.select(MoveId.SPLASH);
    enemyPokemon.damageAndUpdate(1);
    await game.toNextTurn();

    expect(enemyPokemon.status?.effect).toEqual(StatusEffect.SLEEP);
  });

  it("protects from ability-inflicted status", async () => {
    game.override.ability(Abilities.STATIC);
    vi.spyOn(
      allAbilities[Abilities.STATIC].getAttrs<PostDefendContactApplyStatusEffectAbAttr>(
        AbAttrFlag.POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT,
      )[0],
      "chance",
      "get",
    ).mockReturnValue(100);
    await game.classicMode.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    game.override.enemyMoveset([MoveId.TACKLE]);
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemyPokemon.status).toBeUndefined();
  });

  it("should apply even if the user has a fainted ally", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle();

    game.move.use(MoveId.SPORE, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.NUZZLE, 1, BattlerIndex.ENEMY);
    await game.move.forceEnemyMove(MoveId.SAFEGUARD);
    await game.move.forceEnemyMove(MoveId.MEMENTO, BattlerIndex.PLAYER);

    await game.setTurnOrder([BattlerIndex.ENEMY_2, BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);

    const enemyPokemon = game.scene.getEnemyField();

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemyPokemon[1].isFainted()).toBe(true);

    await game.toNextTurn();
    expect(enemyPokemon[0].status).toBeUndefined();
  });
});
