import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Tidy Up", () => {
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
      .enemyMoveset([MoveId.TIDY_UP, MoveId.DRAGON_DANCE]);
  });

  it("should not be preferred when no effects are on the field", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    // Both moves should have equal score -- no strong preference between them
    expect(enemy).not.toNeverSelectMove(MoveId.TIDY_UP);
    expect(enemy).not.toNeverSelectMove(MoveId.DRAGON_DANCE);
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
      expect(enemy).toNeverSelectMove(MoveId.DRAGON_DANCE);
    });

    it(`should be avoided when ${tagName} is on the opponent's side of the field`, async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.arena.addTag(tagType, 0, 0, MoveId.NONE, ArenaTagSide.PLAYER, true);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.TIDY_UP);
    });
  });

  describe("Substitute Removal", () => {
    it("should be preferred when the opponent has a Substitute", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();

      player.addTag(BattlerTagType.SUBSTITUTE, 0, MoveId.SUBSTITUTE, player.id);
      expect(enemy).toNeverSelectMove(MoveId.DRAGON_DANCE);
    });

    it("should be avoided when the user has a Substitute", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      const enemy = game.field.getEnemyPokemon();

      enemy.addTag(BattlerTagType.SUBSTITUTE, 0, MoveId.SUBSTITUTE, enemy.id);
      expect(enemy).toNeverSelectMove(MoveId.TIDY_UP);
    });

    it("should not be preferred when all Pokemon have Substitutes", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      game.scene.getField(true).forEach((p) => p.addTag(BattlerTagType.SUBSTITUTE, 0, MoveId.SUBSTITUTE, p.id));

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toNeverSelectMove(MoveId.TIDY_UP);
      expect(enemy).not.toNeverSelectMove(MoveId.DRAGON_DANCE);
    });
  });
});
