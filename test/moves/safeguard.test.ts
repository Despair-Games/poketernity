import { BattlerIndex } from "#app/battle";
import { allAbilities } from "#app/data/ability";
import { PostDefendContactApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { Abilities } from "#enums/abilities";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

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
    game.overridesHelper
      .battleType("single")
      .enemySpecies(Species.DRATINI)
      .enemyMoveset([Moves.SAFEGUARD])
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyLevel(5)
      .starterSpecies(Species.DRATINI)
      .moveset([Moves.NUZZLE, Moves.SPORE, Moves.YAWN, Moves.SPLASH])
      .ability(Abilities.UNNERVE); // Stop wild Pokemon from potentially eating Lum Berry
  });

  it("protects from damaging moves with additional effects", async () => {
    await game.classicModeHelper.startBattle();
    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.NUZZLE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemy.status).toBeUndefined();
  });

  it("protects from status moves", async () => {
    await game.classicModeHelper.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.SPORE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.status).toBeUndefined();
  });

  it("protects from confusion", async () => {
    game.overridesHelper.moveset([Moves.CONFUSE_RAY]);
    await game.classicModeHelper.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.CONFUSE_RAY);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.summonData.tags).toEqual([]);
  });

  it("protects ally from status", async () => {
    game.overridesHelper.battleType("double");

    await game.classicModeHelper.startBattle();

    game.moveHelper.select(Moves.SPORE, 0, BattlerIndex.ENEMY_2);
    game.moveHelper.select(Moves.NUZZLE, 1, BattlerIndex.ENEMY_2);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("BerryPhase");

    const enemyPokemon = game.scene.getEnemyField();

    expect(enemyPokemon[0].status).toBeUndefined();
    expect(enemyPokemon[1].status).toBeUndefined();
  });

  it("protects from Yawn", async () => {
    await game.classicModeHelper.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.YAWN);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyPokemon.summonData.tags).toEqual([]);
  });

  it("doesn't protect from already existing Yawn", async () => {
    await game.classicModeHelper.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.YAWN);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(enemyPokemon.status?.effect).toEqual(StatusEffect.SLEEP);
  });

  it("doesn't protect from self-inflicted via Rest or Flame Orb", async () => {
    game.overridesHelper.enemyHeldItems([{ name: "FLAME_ORB" }]);
    await game.classicModeHelper.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    enemyPokemon.damageAndUpdate(1);

    expect(enemyPokemon.status?.effect).toEqual(StatusEffect.BURN);

    game.overridesHelper.enemyMoveset([Moves.REST]);
    // Force the moveset to update mid-battle
    // TODO: Remove after enemy AI rework is in
    enemyPokemon.getMoveset();
    game.moveHelper.select(Moves.SPLASH);
    enemyPokemon.damageAndUpdate(1);
    await game.toNextTurn();

    expect(enemyPokemon.status?.effect).toEqual(StatusEffect.SLEEP);
  });

  it("protects from ability-inflicted status", async () => {
    game.overridesHelper.ability(Abilities.STATIC);
    vi.spyOn(
      allAbilities[Abilities.STATIC].getAttrs(PostDefendContactApplyStatusEffectAbAttr)[0],
      "chance",
      "get",
    ).mockReturnValue(100);
    await game.classicModeHelper.startBattle();
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    game.overridesHelper.enemyMoveset([Moves.TACKLE]);
    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(enemyPokemon.status).toBeUndefined();
  });
});
