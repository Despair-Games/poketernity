import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Defog", () => {
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
      .enemyMoveset([MoveId.SPLASH, MoveId.TACKLE, MoveId.DEFOG]);
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
  ])("Hazard Removal", ({ tagName, tagType }) => {
    it(`should be preferred when ${tagName} is on the user's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.ENEMY, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.DEFOG);
    });

    it(`should be avoided when ${tagName} is on the opponent's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.PLAYER, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.DEFOG);
    });
  });

  // TODO: Implement scoring for weather removal and add tests
  describe.todo("Weather Removal");

  // TODO: Implement scoring for terrain removal and add tests
  describe.todo("Terrain Removal");
});
