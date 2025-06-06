import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Court Change", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .enemySpecies(SpeciesId.NINJASK)
      .enemyLevel(100)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  it("should swap arena tags to opponent", async () => {
    game.override.enemyMoveset([MoveId.SPLASH]);
    await game.classicMode.startBattle(SpeciesId.SHUCKLE);

    game.move.use(MoveId.SAFEGUARD);
    await game.toNextTurn();

    const tag1 = game.scene.arena.findTag(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)!;
    expect(tag1.turnCount).toBe(4);
    expect(game.scene.arena.hasTag(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)).toBeFalsy();

    game.move.use(MoveId.COURT_CHANGE);
    await game.toNextTurn();

    const tag2 = game.scene.arena.findTag(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)!;
    expect(tag2.turnCount).toBe(3);
    expect(game.scene.arena.hasTag(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)).toBeFalsy();
  });

  it("should not miss", async () => {
    game.override.enemyMoveset([MoveId.FLY]);
    await game.classicMode.startBattle(SpeciesId.SHUCKLE);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.use(MoveId.SAFEGUARD);
    await game.toNextTurn();

    expect(game.scene.arena.hasTag(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)).toBeTruthy();
    expect(game.scene.arena.hasTag(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)).toBeFalsy();

    game.move.use(MoveId.COURT_CHANGE);
    await game.phaseInterceptor.to("PostActionPhase");
    expect(game.field.getEnemyPokemon().hasTag(BattlerTagType.MID_AIR)).toBeTruthy();
    await game.toNextTurn();

    expect(game.scene.arena.hasTag(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)).toBeTruthy();
    expect(game.scene.arena.hasTag(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)).toBeFalsy();
  });
});
