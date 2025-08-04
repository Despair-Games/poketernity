import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Court Change", () => {
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
      .battleType("double")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100)
      .enemyMoveset([MoveId.SPLASH, MoveId.TACKLE, MoveId.COURT_CHANGE]);
  });

  it("should not be preferred when no effects are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.DEFOG);
  });

  describe.each([
    { tagName: "Spikes", tagType: ArenaTagType.SPIKES },
    { tagName: "Toxic Spikes", tagType: ArenaTagType.TOXIC_SPIKES },
    { tagName: "Stealth Rock", tagType: ArenaTagType.STEALTH_ROCK },
    { tagName: "Sticky Web", tagType: ArenaTagType.STICKY_WEB },
    { tagName: "Sharp Steel", tagType: ArenaTagType.SHARP_STEEL },
  ])("Hazards", ({ tagName, tagType }) => {
    it(`should be preferred when ${tagName} is on the user's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.ENEMY, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.COURT_CHANGE);
    });

    it(`should be avoided when ${tagName} is on the opposing side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.PLAYER, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.COURT_CHANGE);
    });
  });

  describe.each([
    { tagName: "Light Screen", tagType: ArenaTagType.LIGHT_SCREEN },
    { tagName: "Reflect", tagType: ArenaTagType.REFLECT },
    { tagName: "Aurora Veil", tagType: ArenaTagType.AURORA_VEIL },
  ])("Screens", ({ tagName, tagType }) => {
    it(`should be preferred when ${tagName} is on the opposing side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.PLAYER, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.COURT_CHANGE);
    });

    it(`should be avoided when ${tagName} is on the user's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.ENEMY, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.COURT_CHANGE);
    });

    it(`should not gain incentive when ${tagName} is on both sides of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      for (const side of [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY]) {
        game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, side, true);
      }
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toPreferSelectingMove(MoveId.COURT_CHANGE);
    });
  });

  it("should not gain incentive from tags that will expire at the end of the turn", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.scene.arena.addTag(ArenaTagType.LIGHT_SCREEN, 0, 1, MoveId.LIGHT_SCREEN, ArenaTagSide.PLAYER, true);
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.COURT_CHANGE);
  });
});
