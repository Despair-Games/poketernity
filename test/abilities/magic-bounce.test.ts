import type { EncoreTag } from "#app/data/battler-tags";
import { allMoves } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Magic Bounce", () => {
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
      .enemyAbility(Abilities.MAGIC_BOUNCE)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should reflect basic status moves", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);

    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(-1);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should reflect basic status moves (enemy)", async () => {
    game.override.ability(Abilities.MAGIC_BOUNCE).enemyAbility(Abilities.BALL_FETCH);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.GROWL);

    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(enemy.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should not bounce moves while the target is in the semi-invulnerable state", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.GROWL);
    await game.move.forceEnemyMove(MoveId.FLY);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should individually bounce back multi-target moves", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    game.move.use(MoveId.GROWL, 0);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    const user = game.scene.getPlayerField()[0];
    expect(user.getStatStage(Stat.ATK)).toBe(-2);
  });

  it("should still bounce back a move that would otherwise fail", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    enemy.setStatStage(Stat.ATK, -6);

    game.move.use(MoveId.GROWL);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should not bounce back a move that was just bounced", async () => {
    game.override.ability(Abilities.MAGIC_BOUNCE);
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(-1);
    expect(enemy.getStatStage(Stat.ATK)).toBe(0);
  });

  it("should receive the stat change after reflecting a move back to a mirror armor user", async () => {
    game.override.ability(Abilities.MIRROR_ARMOR);
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(enemy.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should not bounce back a move from a mold breaker user", async () => {
    game.override.ability(Abilities.MOLD_BREAKER);
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.GROWL);
    await game.toEndOfTurn();

    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(enemy.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should bounce back a spread status move against both pokemon", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();

    game.move.use(MoveId.GROWL, 0);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();
    playerPokemon.forEach((p) => expect(p.getStatStage(Stat.ATK)).toBe(-2));
  });

  it("should only bounce spikes back once in doubles when both targets have magic bounce", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.use(MoveId.SPIKES);
    await game.toEndOfTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.PLAYER)?.["layers"]).toBe(1);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY)).toBeUndefined();
  });

  it("should bounce spikes even when the target is protected", async () => {
    game.override.enemyMoveset(MoveId.PROTECT);
    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.use(MoveId.SPIKES);
    await game.toEndOfTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.PLAYER)?.["layers"]).toBe(1);
  });

  it("should not bounce spikes when the target is in the semi-invulnerable state", async () => {
    game.override.enemyMoveset(MoveId.FLY);
    await game.classicMode.startBattle([Species.MAGIKARP]);

    game.move.use(MoveId.SPIKES);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY)!["layers"]).toBe(1);
  });

  it("should not bounce back curse", async () => {
    game.override.starterSpecies(Species.GASTLY);
    await game.classicMode.startBattle([Species.GASTLY]);

    game.move.use(MoveId.CURSE);
    await game.toEndOfTurn();

    expect(game.field.getEnemyPokemon().getTag(BattlerTagType.CURSED)).toBeDefined();
  });

  it("should not cause encore to be interrupted after bouncing", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);
    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    // Give the player MOLD_BREAKER for this turn to bypass Magic Bounce.
    game.field.mockAbility(player, Abilities.MOLD_BREAKER);

    // turn 1
    game.move.use(MoveId.ENCORE);
    await game.move.forceEnemyMove(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();
    expect(enemy.getTag<EncoreTag>(BattlerTagType.ENCORE)?.moveId).toBe(MoveId.TACKLE);

    // turn 2
    vi.spyOn(player, "getAbility").mockRestore();

    game.move.use(MoveId.GROWL);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();
    expect(enemy.getTag<EncoreTag>(BattlerTagType.ENCORE)?.moveId).toBe(MoveId.TACKLE);
    console.log(enemy.getMoveHistory().map((turnMove) => MoveId[turnMove.move.id]));
    expect(enemy.getLastXMoves()[0].move.id).toBe(MoveId.TACKLE);
  });

  it("should not cause the bounced move to count for encore", async () => {
    game.override.enemyMoveset([MoveId.GROWL, MoveId.TACKLE]);
    game.override.enemyAbility(Abilities.MAGIC_BOUNCE);

    await game.classicMode.startBattle([Species.MAGIKARP]);
    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();

    // turn 1
    game.move.use(MoveId.GROWL);
    await game.move.forceEnemyMove(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    // Give the player MOLD_BREAKER for this turn to bypass Magic Bounce.
    game.field.mockAbility(playerPokemon, Abilities.MOLD_BREAKER);

    // turn 2
    game.move.use(MoveId.ENCORE);
    await game.move.forceEnemyMove(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();
    expect(enemyPokemon.getTag<EncoreTag>(BattlerTagType.ENCORE)?.moveId).toBe(MoveId.TACKLE);
    expect(enemyPokemon.getLastXMoves()[0].move.id).toBe(MoveId.TACKLE);
  });

  it("should cause stomping tantrum to double in power when the last move was bounced", async () => {
    game.override.battleType("single");
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const stomping_tantrum = allMoves.get(MoveId.STOMPING_TANTRUM);
    vi.spyOn(stomping_tantrum, "calculateBattlePower");

    game.move.use(MoveId.CHARM);
    await game.toNextTurn();

    game.move.use(MoveId.STOMPING_TANTRUM);
    await game.toEndOfTurn();
    expect(stomping_tantrum.calculateBattlePower).toHaveReturnedWith(150);
  });

  it("should properly cause the enemy's stomping tantrum to be doubled in power after bouncing and failing", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);

    const stomping_tantrum = allMoves.get(MoveId.STOMPING_TANTRUM);
    const enemy = game.field.getEnemyPokemon();
    vi.spyOn(stomping_tantrum, "calculateBattlePower");

    game.move.use(MoveId.SPORE);
    await game.move.forceEnemyMove(MoveId.CHARM);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toNextTurn();
    expect(enemy.getLastXMoves(1)[0].result).toBe(MoveResult.FAIL);

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.STOMPING_TANTRUM);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toNextTurn();
    expect(stomping_tantrum.calculateBattlePower).toHaveReturnedWith(150);

    game.move.use(MoveId.GROWL);
    await game.move.forceEnemyMove(MoveId.STOMPING_TANTRUM);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.toNextTurn();

    expect(stomping_tantrum.calculateBattlePower).toHaveReturnedWith(75);
  });

  it("should respect immunities when bouncing a move", async () => {
    vi.spyOn(allMoves.get(MoveId.THUNDER_WAVE), "accuracy", "get").mockReturnValue(100);
    game.override.ability(Abilities.SOUNDPROOF);
    await game.classicMode.startBattle([Species.PHANPY]);

    // Turn 1 - thunder wave immunity test
    game.move.use(MoveId.THUNDER_WAVE);
    await game.toEndOfTurn();
    expect(game.field.getPlayerPokemon().status).toBeUndefined();

    // Turn 2 - soundproof immunity test
    game.move.use(MoveId.GROWL);
    await game.toEndOfTurn();
    expect(game.field.getPlayerPokemon().getStatStage(Stat.ATK)).toBe(0);
  });

  it("should bounce back a move before the accuracy check", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const attacker = game.field.getPlayerPokemon();

    vi.spyOn(attacker, "getAccuracyMultiplier").mockReturnValue(0);
    game.move.use(MoveId.SPORE);
    await game.toEndOfTurn();
    expect(game.field.getPlayerPokemon().getStatusEffect()).toBe(StatusEffect.SLEEP);
  });

  it("should take the accuracy of the magic bounce user into account", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);
    const opponent = game.field.getEnemyPokemon();

    vi.spyOn(opponent, "getAccuracyMultiplier").mockReturnValue(0);
    game.move.use(MoveId.SPORE);
    await game.toEndOfTurn();
    expect(game.field.getPlayerPokemon().status).toBeUndefined();
  });

  it("should always apply the leftmost available target's magic bounce when bouncing moves like sticky webs in doubles", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([Species.MAGIKARP, Species.MAGIKARP]);
    const [enemy_1, enemy_2] = game.scene.getEnemyField();
    // set speed just incase logic erroneously checks for speed order
    enemy_1.setStat(Stat.SPD, enemy_2.getStat(Stat.SPD) + 1);

    // turn 1
    game.move.use(MoveId.STICKY_WEB, 0);
    game.move.use(MoveId.TRICK_ROOM, 1);
    await game.toEndOfTurn();

    expect(
      game.scene.arena
        .getTagOnSide(ArenaTagType.STICKY_WEB, ArenaTagSide.PLAYER)
        ?.getSourcePokemon()
        ?.getBattlerIndex(),
    ).toBe(BattlerIndex.ENEMY);
    game.scene.arena.removeTagOnSide(ArenaTagType.STICKY_WEB, ArenaTagSide.PLAYER, true);

    // turn 2
    game.move.use(MoveId.STICKY_WEB, 0);
    game.move.use(MoveId.TRICK_ROOM, 1);
    await game.toEndOfTurn();
    expect(
      game.scene.arena
        .getTagOnSide(ArenaTagType.STICKY_WEB, ArenaTagSide.PLAYER)
        ?.getSourcePokemon()
        ?.getBattlerIndex(),
    ).toBe(BattlerIndex.ENEMY);
  });

  it("should not bounce back status moves that hit through semi-invulnerable states", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);
    game.move.use(MoveId.TOXIC);
    await game.move.forceEnemyMove(MoveId.FLY);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();
    expect(game.field.getEnemyPokemon().getStatusEffect()).toBe(StatusEffect.TOXIC);
    expect(game.field.getPlayerPokemon().status).toBeUndefined();

    game.override.ability(Abilities.NO_GUARD);
    game.move.use(MoveId.CHARM);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();
    expect(game.field.getEnemyPokemon().getStatStage(Stat.ATK)).toBe(-2);
    expect(game.field.getPlayerPokemon().getStatStage(Stat.ATK)).toBe(0);
  });
});
