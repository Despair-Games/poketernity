import { ArenaTagSide } from "#enums/arena-tag-side";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Defog", () => {
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
      .moveset([MoveId.DEFOG])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should lower the target's Evasion stat", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.DEFOG);
    await game.toEndOfTurn();

    expect(enemy.getStatStage(Stat.EVA)).toBe(-1);
  });

  it.each([
    { tagType: ArenaTagType.SPIKES, name: "Spikes" },
    { tagType: ArenaTagType.TOXIC_SPIKES, name: "Toxic Spikes" },
    { tagType: ArenaTagType.STEALTH_ROCK, name: "Stealth Rock" },
    { tagType: ArenaTagType.STICKY_WEB, name: "Sticky Web" },
  ])("should remove the effects of $name from all sides of the field", async ({ tagType }) => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY].forEach((side) =>
      game.scene.arena.addTag(tagType, 0, 2, MoveId.NONE, side, true),
    );

    game.move.select(MoveId.DEFOG);

    await game.toEndOfTurn();

    [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY].forEach((side) =>
      expect(game.scene.arena.getTagOnSide(tagType, side)).toBeUndefined(),
    );
  });

  it.each([
    { tagType: ArenaTagType.LIGHT_SCREEN, name: "Light Screen" },
    { tagType: ArenaTagType.REFLECT, name: "Reflect" },
    { tagType: ArenaTagType.SAFEGUARD, name: "Safeguard" },
    { tagType: ArenaTagType.MIST, name: "Mist" },
    { tagType: ArenaTagType.AURORA_VEIL, name: "Aurora Veil" },
  ])("should remove the effects of $name from only the target's side of the field", async ({ tagType }) => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY].forEach((side) =>
      game.scene.arena.addTag(tagType, 0, 2, MoveId.NONE, side, true),
    );

    game.move.select(MoveId.DEFOG);

    await game.toEndOfTurn();

    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.ENEMY)).toBeUndefined();
  });
});
