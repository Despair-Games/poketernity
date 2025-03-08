import type { BypassSpeedChanceAbAttr } from "#app/data/ab-attrs/bypass-speed-chance-ab-attr";
import { allAbilities } from "#app/data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Trick Room", () => {
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
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should reverse speed order", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());

    await game.toNextTurn();
    game.move.use(MoveId.TRICK_ROOM);
    await game.toNextTurn();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    expect(game.scene.arena.getTag(ArenaTagType.TRICK_ROOM)).toBeDefined();
  });

  it("should cancel an active Trick Room if used again", async () => {
    game.override.enemyMoveset([]);
    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.use(MoveId.TRICK_ROOM);
    await game.move.forceEnemyMove(MoveId.TRICK_ROOM);
    await game.toNextTurn();

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
    expect(game.scene.arena.getTag(ArenaTagType.TRICK_ROOM)).toBeUndefined();
  });

  it("should not reverse move priority order", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.use(MoveId.TRICK_ROOM);
    await game.toNextTurn();

    game.move.use(MoveId.BABY_DOLL_EYES);
    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.scene.arena.getTag(ArenaTagType.TRICK_ROOM)).toBeDefined();
  });

  it("should not reverse effects which cause Pokemon to move first/last within a priority bracket", async () => {
    game.override.ability(Abilities.QUICK_DRAW);

    const quickDrawAbAttr = allAbilities[Abilities.QUICK_DRAW].getAttrs<BypassSpeedChanceAbAttr>(
      AbAttrFlag.BYPASS_SPEED_CHANCE,
    )[0];
    vi.spyOn(quickDrawAbAttr, "chance", "get").mockReturnValue(100);

    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.use(MoveId.TRICK_ROOM);
    await game.toNextTurn();

    game.move.use(MoveId.FALSE_SWIPE);
    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.scene.arena.getTag(ArenaTagType.TRICK_ROOM)).toBeDefined();
  });
});
