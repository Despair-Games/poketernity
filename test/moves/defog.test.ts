import { ArenaTagSide } from "#enums/arena-tag-side";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should lower the target's Evasion stat", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

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
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

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
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY].forEach((side) =>
      game.scene.arena.addTag(tagType, 0, 2, MoveId.NONE, side, true),
    );

    game.move.select(MoveId.DEFOG);

    await game.toEndOfTurn();

    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.PLAYER)).toBeDefined();
    expect(game.scene.arena.getTagOnSide(tagType, ArenaTagSide.ENEMY)).toBeUndefined();
  });
});
