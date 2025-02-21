import { BattlerIndex } from "#enums/battler-index";
import type { EntryHazardTag } from "#app/data/arena-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Toxic Spikes", () => {
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
      .startingWave(5)
      .enemySpecies(Species.RATTATA)
      .enemyAbility(Abilities.BALL_FETCH)
      .ability(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .moveset([MoveId.TOXIC_SPIKES, MoveId.SPLASH, MoveId.ROAR, MoveId.COURT_CHANGE]);
  });

  it("should not affect the opponent if they do not switch", async () => {
    await game.classicMode.startBattle([Species.MIGHTYENA, Species.POOCHYENA]);

    const enemy = game.scene.getEnemyField()[0];

    game.move.select(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();

    expect(enemy.hp).toBe(enemy.getMaxHp());
    expect(enemy.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });

  it("should poison the opponent if they switch into 1 layer", async () => {
    await game.classicMode.startBattle([Species.MIGHTYENA]);

    game.move.select(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();
    game.move.select(MoveId.ROAR);
    await game.toNextTurn();

    const enemy = game.scene.getEnemyField()[0];

    expect(enemy.hp).toBeLessThan(enemy.getMaxHp());
    expect(enemy.getStatusEffect(true)).toBe(StatusEffect.POISON);
  });

  it("should badly poison the opponent if they switch into 2 layers", async () => {
    await game.classicMode.startBattle([Species.MIGHTYENA]);

    game.move.select(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();
    game.move.select(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();
    game.move.select(MoveId.ROAR);
    await game.toNextTurn();

    const enemy = game.scene.getEnemyField()[0];
    expect(enemy.hp).toBeLessThan(enemy.getMaxHp());
    expect(enemy.getStatusEffect(true)).toBe(StatusEffect.TOXIC);
  });

  it("should be removed if a grounded poison pokemon switches in", async () => {
    await game.classicMode.startBattle([Species.MUK, Species.PIDGEY]);

    const muk = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();
    // also make sure the toxic spikes are removed even if the pokemon
    // that set them up is the one switching in
    game.move.select(MoveId.COURT_CHANGE);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    expect(muk.isFullHp()).toBe(true);
    expect(muk.getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(game.scene.arena.tags.length).toBe(0);
  });

  it("shouldn't create multiple layers per use in doubles", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([Species.MIGHTYENA, Species.POOCHYENA]);

    game.move.select(MoveId.TOXIC_SPIKES, 0);
    game.move.select(MoveId.SPLASH, 1);
    await game.toNextTurn();

    const arenaTags = game.scene.arena.getTagOnSide(ArenaTagType.TOXIC_SPIKES, ArenaTagSide.ENEMY) as EntryHazardTag;
    expect(arenaTags.tagType).toBe(ArenaTagType.TOXIC_SPIKES);
    expect(arenaTags.layers).toBe(1);
  });

  it("should persist through reload", async () => {
    game.override.startingWave(1);

    await game.classicMode.startBattle([Species.MIGHTYENA]);

    game.move.select(MoveId.TOXIC_SPIKES);
    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.toNextWave();

    await game.reload.reloadSession();

    const arenaTags = game.scene.arena.getTagOnSide(ArenaTagType.TOXIC_SPIKES, ArenaTagSide.ENEMY) as EntryHazardTag;
    expect(arenaTags.tagType).toBe(ArenaTagType.TOXIC_SPIKES);
    expect(arenaTags.layers).toBe(1);
  });

  it("should apply even if the target is fainted", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.use(MoveId.TOXIC_SPIKES);
    await game.move.forceEnemyMove(MoveId.MEMENTO);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemyPokemon.isFainted()).toBe(true);
    await game.toNextTurn();

    const arenaTags = game.scene.arena.getTagOnSide(ArenaTagType.TOXIC_SPIKES, ArenaTagSide.ENEMY) as EntryHazardTag;
    expect(arenaTags.tagType).toBe(ArenaTagType.TOXIC_SPIKES);
    expect(arenaTags.layers).toBe(1);
  });
});
